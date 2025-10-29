<?php
declare(strict_types=1);

namespace App\Helpers;

final class DataHelper
{
    /** Inline HTML tagy, které se lepí do odstavce místo samostatných bloků. */
    private const INLINE_TAGS = [
        'a','span','strong','b','em','i','mark','u','s','code','kbd','sup','sub','small','abbr','cite','q','time','var','br'
    ];

    /** Konzervativní whitelist SVG elementů pro základní sanitizaci (rozšířen o <use>). */
    private const SVG_ALLOWED_TAGS = [
        'svg','g','path','circle','ellipse','rect','line','polyline','polygon',
        'defs','clipPath','mask','pattern','linearGradient','radialGradient',
        'stop','symbol','use','title','desc'
    ];

    /**
     * Konzervativní whitelist SVG atributů (mimo všech on* a bez style).
     * – doplněny běžné a11y a typografické atributy, namespace atributy, gradient/pattern transform apod.
     * – navíc v kódu povolíme i jakékoliv aria-* (prefixově) a zahodíme všechna on* + style.
     */
    private const SVG_ALLOWED_ATTRS = [
        // namespace / kořen
        'xmlns','xmlns:xlink','xml:space',
        // základní rozměry a viewbox
        'viewBox','width','height','x','y',
        // geometrie / path
        'cx','cy','r','rx','ry','d','x1','y1','x2','y2','points','pathLength',
        // barvy / tahy / opacity
        'fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','stroke-miterlimit','stroke-dasharray','stroke-dashoffset',
        'opacity','fill-opacity','stroke-opacity','stop-color','stop-opacity',
        // transformace a jednotky
        'transform','preserveAspectRatio',
        'gradientUnits','gradientTransform',
        'patternUnits','patternContentUnits','patternTransform',
        'clip-path','clipPathUnits',
        'mask','maskUnits','maskContentUnits',
        'filter','filterUnits',
        // reference / id / class
        'href','xlink:href','id','class',
        // marker
        'marker-start','marker-mid','marker-end','markerWidth','markerHeight','markerUnits',
        // typografie / přístupnost
        'dominant-baseline','text-anchor','pointer-events','role','focusable','tabindex',
    ];

    /* =========================
     *  Public API — HTML/SVG bezpečnost
     * ========================= */

    /** Hrubá heuristika, zda řetězec pravděpodobně obsahuje HTML. */
    public static function looksLikeHtml(string $s): bool
    {
        return (bool) preg_match('/<\/?[a-z][\s\S]*>/i', $s);
    }

    /**
     * Vrátí čisté <svg>…</svg> bez <script>/<style>, bez on* atributů a bez nebezpečných URL.
     * Neparsovatelný nebo ne-SVG vstup vrací prázdný string.
     * + Guard: limit velikosti pro prevenci zip-bomb / pathologických vstupů.
     */
    public static function sanitizeSvg(string $svg): string
    {
        $svg = trim($svg);
        // velikostní limit (cca 500 kB) – měřeno v raw bajtech
        if ($svg === '' || strlen($svg) > 500_000) {
            return '';
        }

        $doc  = new \DOMDocument('1.0', 'UTF-8');
        $prev = libxml_use_internal_errors(true);
        try {
            // Bez externích zdrojů; žádné entity expandování (NOENT nepoužíváme)
            if (!$doc->loadXML($svg, LIBXML_NONET)) {
                return '';
            }
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($prev);
        }

        $root = $doc->documentElement;
        if (!$root || strtolower($root->nodeName) !== 'svg') {
            return '';
        }

        // Připrav whitelisty jednou (lowercase klíče → O(1) membership)
        $allowedTagsLower  = array_fill_keys(array_map('strtolower', self::SVG_ALLOWED_TAGS), true);
        $allowedAttrsLower = array_fill_keys(array_map('strtolower', self::SVG_ALLOWED_ATTRS), true);

        self::sanitizeSvgNodeRecursive($doc, $root, $allowedTagsLower, $allowedAttrsLower);

        $out = $doc->saveXML($root);
        return is_string($out) ? trim($out) : '';
    }

    /**
     * Detekce aktivního JS ve fragmentu HTML: <script>, on* atributy, javascript: schéma, nebezpečné data:.
     * DŮLEŽITÉ: Povoluje normální http(s) odkazy → žádné false positive kvůli obyčejným URL.
     */
    public static function containsInlineJs(string $html): bool
    {
        if ($html === '') return false;

        $doc   = new \DOMDocument('1.0', 'UTF-8');
        $prev  = libxml_use_internal_errors(true);
        try {
            $encoded = mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');
            if (!$doc->loadHTML('<div id="__wrap__">'.$encoded.'</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NONET)) {
                return false;
            }
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($prev);
        }

        $wrap = $doc->getElementById('__wrap__');
        if (!$wrap) return false;

        $xp = new \DOMXPath($doc);

        if (($xp->query('.//script', $wrap)?->length ?? 0) > 0) {
            return true;
        }

        foreach ($xp->query('.//*[@*]', $wrap) ?? [] as $el) {
            /** @var \DOMElement $el */
            foreach (iterator_to_array($el->attributes) as $attr) {
                if (self::isInlineJsVectorAttr($attr->name, (string)$attr->value)) {
                    return true;
                }
            }
        }

        return false;
    }

    /* =========================
     *  Public API — Normalizace obsahu a layout
     * ========================= */

    /**
     * Převod položek obsahu na pole „bloků“ (typy: p/h3/ul/ol/raw).
     * Vstup může být string (rozdělí se na odstavce) nebo pole položek s klíčem 'html' či 'text'.
     *
     * @param  string|array $items
     * @return array<int, array>
     */
    public static function normalizeItemsToBlocks(string|array $items): array
    {
        $items  = is_array($items) ? $items : [$items];
        $blocks = [];

        foreach ($items as $it) {
            // 1) Čistý string → rozsekat na <p>
            if (is_string($it)) {
                $new = self::splitTextToParagraphBlocks($it);
                if (!empty($new)) { array_push($blocks, ...$new); }
                continue;
            }

            // 2) Objekt s html/text (+ případný explicitní type)
            if (is_array($it) && (array_key_exists('html', $it) || array_key_exists('text', $it) || array_key_exists('type', $it))) {
                $type = strtolower(trim((string)($it['type'] ?? '')));
                $text = isset($it['text']) && is_string($it['text']) ? trim($it['text']) : null;
                $html = isset($it['html']) && is_string($it['html']) ? trim($it['html']) : null;

                // === Respektuj explicitní typy ===
                if (in_array($type, ['h3','p','ul','ol','raw'], true)) {
                    switch ($type) {
                        case 'h3':
                        case 'p': {
                            // v <h3> renderujeme innerHTML, ne celé <h3>…</h3>
                            $inner = $html !== null && $html !== ''
                                ? (preg_match('~^\s*<'.$type.'\b[^>]*>([\s\S]*)</'.$type.'>\s*$~i', $html, $m) ? $m[1] : $html)
                                : htmlspecialchars((string)$text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
                            $blocks[] = ['type' => $type, 'html' => $inner];
                            break;
                        }
                        case 'ul':
                        case 'ol': {
                            $markup = $html ?? $text ?? '';
                            if ($markup !== '' && !preg_match('~^\s*<'.$type.'\b~i', $markup)) {
                                // není-li zabalené, zabal to
                                // (když nejsou <li>, udělej je z řádků)
                                if (!preg_match('~<li\b~i', $markup)) {
                                    $lis = array_filter(array_map('trim', preg_split('/\r?\n+/', (string)$markup) ?: []));
                                    if ($lis) {
                                        $lis = array_map(fn($s) => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'), $lis);
                                        $markup = '<'.$type.'><li>'.implode('</li><li>', $lis).'</li></'.$type.'>';
                                    } else {
                                        $markup = '<'.$type.'>'.$markup.'</'.$type.'>';
                                    }
                                } else {
                                    $markup = '<'.$type.'>'.$markup.'</'.$type.'>';
                                }
                            }
                            $blocks[] = ['type' => $type, 'html' => $markup];
                            break;
                        }
                        case 'raw': {
                            $blocks[] = ['type' => 'raw', 'html' => $html ?? ($text ?? '')];
                            break;
                        }
                    }
                    continue;
                }

                // === Bez explicitního typu → původní chování ===
                if ($html !== null && $html !== '') {
                    $new = self::htmlToBlocks($html);
                    if (!empty($new)) { array_push($blocks, ...$new); }
                } elseif ($text !== null && $text !== '') {
                    $new = self::splitTextToParagraphBlocks($text);
                    if (!empty($new)) { array_push($blocks, ...$new); }
                }
                continue;
            }

            // 3) Složené struktury (mix stringů/objektů v poli)
            if (is_array($it)) {
                foreach ($it as $sub) {
                    if (is_string($sub)) {
                        array_push($blocks, ...self::splitTextToParagraphBlocks($sub));
                    } elseif (is_array($sub) && (array_key_exists('html', $sub) || array_key_exists('text', $sub) || array_key_exists('type', $sub))) {
                        // rekurzivně přes stejnou logiku
                        array_push($blocks, ...self::normalizeItemsToBlocks([$sub]));
                    }
                }
            }
        }

        return array_values($blocks);
    }


    /**
     * Převod normalizovaných sekcí na zjednodušené “rows” pro UI
     * (text-only / image-only / split / columns). 'features' se úmyslně nepřevádí.
     *
     * @param  array<int, array> $blocks  Normalizované sekce (např. ze ServiceTrait)
     * @return array<int, array>          UI „rows“ pro snadné renderování
     */
    public static function blocksToRows(array $blocks): array
    {
        $rows       = [];
        $splitIndex = 0;

        foreach ($blocks as $b) {
            $type  = strtolower((string)($b['type'] ?? 'split'));
            $title = (string)($b['title'] ?? '');

            if ($type === 'features') {
                continue;
            }

            if ($type === 'columns') {
                $c0 = is_array($b['columns'][0] ?? null) ? $b['columns'][0] : [];
                $c1 = is_array($b['columns'][1] ?? null) ? $b['columns'][1] : [];
                $rows[] = [
                    'kind'    => 'columns',
                    'title'   => $title,
                    'columns' => [$c0, $c1],
                ];
                continue;
            }

            $content = is_array($b['content'] ?? null) ? $b['content'] : [];
            $image   = array_key_exists('image', $b) ? ImageHelper::normalizeImage($b['image'], $title) : null;

            if (!$image && $content) {
                $rows[] = [
                    'kind'       => 'text-only',
                    'title'      => $title,
                    'paragraphs' => $content,
                ];
                continue;
            }

            if ($image && !$content) {
                $rows[] = [
                    'kind'  => 'image-only',
                    'title' => $title,
                    'image' => $image,
                ];
                continue;
            }

            $imgLeft = isset($b['imagePosition'])
                ? (strtolower((string)$b['imagePosition']) === 'left')
                : (($splitIndex % 2) === 1);

            $rows[] = [
                'kind'       => 'split',
                'title'      => $title,
                'paragraphs' => $content,
                'image'      => $image,
                'imgLeft'    => $imgLeft,
                'matchText'  => self::isLongText($content),
            ];
            $splitIndex++;
        }

        return array_values($rows);
    }

    /** Heuristika, kdy je text „dlouhý“ pro layout (kombinace počtu bloků a délky). */
    public static function isLongText(array $paragraphBlocks): bool
    {
        $count = count($paragraphBlocks);
        $chars = 0;
        foreach ($paragraphBlocks as $p) {
            $chars += self::plainLenFromBlock((array)$p);
        }
        return ($count >= 4) || ($chars >= 600);
    }

    /* =========================
     *  Public API — Google Maps helpery
     * ========================= */

    /**
     * Sestaví bezpečné embed URL na základě adresy (generujeme server-side, nepřebíráme hotové iframe src).
     */
    public static function buildGoogleMapsEmbedFromAddress(string $address, string $locale = 'cs-CZ', int $z = 12): string
    {
        $addr = trim($address);
        if ($addr === '') return '';
        $q = rawurlencode($addr);
        return "https://www.google.com/maps?q={$q}&hl={$locale}&z={$z}&output=embed";
    }

    /**
     * Sanitizuje již připravené URL pro Google Maps embed. Vrací prázdný řetězec, pokud nevyhoví whitelistu.
     */
    public static function sanitizeGoogleMapsEmbedUrl(string $url, bool $requireEmbed = false): string
    {
        $url = trim($url);
        if ($url === '') return '';

        $u = @parse_url($url);
        if (!is_array($u)) return '';

        $host = strtolower($u['host'] ?? '');
        $path = (string) ($u['path'] ?? '');
        // povolíme google.com, google.{ccTLD}, google.co.{cc}
        if ($host === '' || !preg_match('~(^|\.)google\.(com|[a-z]{2,3}|co\.[a-z]{2})$~', $host)) {
            return '';
        }
        if (!str_starts_with($path, '/maps')) return '';

        // normalize: https + bez fragmentu, query přestavíme
        $scheme = 'https';
        $query  = [];
        if (isset($u['query'])) {
            parse_str($u['query'], $query);
        }
        if ($requireEmbed) {
            $query['output'] = 'embed';
        }
        $q = http_build_query($query);

        return $scheme . '://' . $host . $path . ($q ? '?' . $q : '');
    }


    /* =========================
     *  Private — text/HTML normalizace
     * ========================= */

    /** @return array<int, string> */
    private static function splitTextToParagraphs(string $text): array
    {
        $parts = preg_split('/\r?\n+/', $text) ?: [$text];
        $out   = [];
        foreach ($parts as $p) {
            $p = trim($p);
            if ($p !== '') $out[] = $p;
        }
        return $out;
    }

    /** @return array<int, array{type:string, html:string}> */
    private static function splitTextToParagraphBlocks(string $text): array
    {
        return array_map(function ($t) {
            $safe = htmlspecialchars($t, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
            return ['type' => 'p', 'html' => $safe];
        }, self::splitTextToParagraphs($text));
    }

    /**
     * Parsuje HTML fragment a převádí ho na bloky. Textové a inline uzly lepí do probíhajícího <p>.
     * Blokové tagy (h3/p/ul/ol) se přenáší jako samostatné bloky; ostatní jako 'raw'.
     *
     * @return array<int, array{type:string, html?:string, text?:string}>
     */
    private static function htmlToBlocks(string $html): array
    {
        $doc   = new \DOMDocument('1.0', 'UTF-8');
        $html  = mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');
        $prev  = libxml_use_internal_errors(true);
        try {
            $doc->loadHTML('<div id="__wrap__">'.$html.'</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NONET);
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($prev);
        }

        $wrap = $doc->getElementById('__wrap__');
        if (!$wrap) return [['type' => 'raw', 'html' => $html]];

        $blocks = [];
        $buf    = '';

        $nodeHtml = function(\DOMNode $n) use ($doc): string {
            return (string) $doc->saveHTML($n);
        };

        $flushBuf = function() use (&$buf, &$blocks) {
            if (preg_match('/\S/u', $buf)) {
                $blocks[] = ['type' => 'p', 'html' => $buf];
            }
            $buf = '';
        };

        foreach ($wrap->childNodes as $node) {
            if ($node->nodeType === XML_TEXT_NODE) {
                $buf .= $nodeHtml($node);
                continue;
            }
            if ($node->nodeType !== XML_ELEMENT_NODE) continue;

            $tag = strtolower($node->nodeName);

            if (in_array($tag, self::INLINE_TAGS, true)) {
                $buf .= $nodeHtml($node);
                continue;
            }

            $flushBuf();

            if (in_array($tag, ['h3','p','ul','ol'], true)) {
                if ($tag === 'p')      $blocks[] = ['type' => 'p',  'html' => self::innerHtml($node)];
                elseif ($tag === 'h3') $blocks[] = ['type' => 'h3', 'html' => self::innerHtml($node)];
                else                   $blocks[] = ['type' => $tag, 'html' => self::outerHtml($doc, $node)];
            } else {
                $blocks[] = ['type' => 'raw', 'html' => self::outerHtml($doc, $node)];
            }
        }

        $flushBuf();

        return $blocks;
    }

    /** Vnitřní HTML elementu bez ořezu mezer (zachování whitespace je žádoucí). */
    private static function innerHtml(\DOMNode $node): string
    {
        $html = '';
        foreach ($node->childNodes as $child) {
            $html .= $node->ownerDocument->saveHTML($child);
        }
        return $html;
    }

    /** Vnější HTML elementu bez trimu (zachování whitespace). */
    private static function outerHtml(\DOMDocument $doc, \DOMNode $node): string
    {
        $h = $doc->saveHTML($node);
        return is_string($h) ? $h : '';
    }

    private static function plainLenFromBlock(array $b): int
    {
        if (($b['type'] ?? '') !== 'p') {
            $html = (string)($b['html'] ?? '');
            return $html !== '' ? mb_strlen(strip_tags($html)) : 0;
        }
        if (isset($b['text'])) return mb_strlen((string)$b['text']);
        if (isset($b['html'])) return mb_strlen(strip_tags((string)$b['html']));
        return 0;
    }

    /* =========================
     *  Private — SVG sanitizace
     * ========================= */

    /**
     * Rekurzivně prochází SVG, odstraňuje nepovolené elementy/atributy a nebezpečné hodnoty.
     * - whitelist tagů/attr se předává zvenku (nevytváří se v každé rekurzi)
     * - zahazuje <script>/<style> elementy
     * - zahazuje všechny on* atributy
     * - zahazuje celý atribut style (nejpřísnější varianta)
     * - odfiltruje nebezpečné URL (javascript:, externí url(), data: mimo image/*)
     * - u href/xlink:href povolí pouze lokální fragmenty (#id)
     * - navíc povolí aria-* atributy (prefixově), i když nejsou v explicitním whitelistu
     *
     * @param array<string,true> $allowedTagsLower
     * @param array<string,true> $allowedAttrsLower
     */
    private static function sanitizeSvgNodeRecursive(
        \DOMDocument $doc,
        \DOMNode $node,
        array $allowedTagsLower,
        array $allowedAttrsLower
    ): void {
        if ($node->nodeType === XML_COMMENT_NODE || $node->nodeType === XML_PI_NODE) {
            $node->parentNode?->removeChild($node);
            return;
        }

        if ($node->nodeType !== XML_ELEMENT_NODE) {
            foreach (iterator_to_array($node->childNodes ?? []) as $child) {
                self::sanitizeSvgNodeRecursive($doc, $child, $allowedTagsLower, $allowedAttrsLower);
            }
            return;
        }

        /** @var \DOMElement $el */
        $el  = $node;
        $tag = strtolower($el->tagName);

        if (!isset($allowedTagsLower[$tag])) {
            $el->parentNode?->removeChild($el);
            return;
        }

        if ($tag === 'script' || $tag === 'style') {
            $el->parentNode?->removeChild($el);
            return;
        }

        foreach (iterator_to_array($el->attributes) as $attr) {
            $lname = strtolower($attr->nodeName);
            $val   = (string) $attr->nodeValue;

            // 1) on* pryč (inline eventy)
            if (str_starts_with($lname, 'on')) {
                $el->removeAttributeNode($attr);
                continue;
            }

            // 2) style úplně pryč (přísná varianta)
            if ($lname === 'style') {
                $el->removeAttributeNode($attr);
                continue;
            }

            // 3) aria-* povolit prefixově
            if (str_starts_with($lname, 'aria-')) {
                if (self::isDangerousUrlAttr($lname, $val)) {
                    $el->removeAttributeNode($attr);
                }
                continue;
            }

            // 4) mimo whitelist → pryč
            if (!isset($allowedAttrsLower[$lname])) {
                $el->removeAttributeNode($attr);
                continue;
            }

            // 5) URL-atributy – validace
            if (self::isDangerousUrlAttr($lname, $val)) {
                $el->removeAttributeNode($attr);
                continue;
            }

            // 6) href / xlink:href – pouze #fragment
            if ($lname === 'href' || $lname === 'xlink:href') {
                $trimmed = trim($val);
                if ($trimmed !== '' && !str_starts_with($trimmed, '#')) {
                    $el->removeAttributeNode($attr);
                    continue;
                }
            }
        }

        foreach (iterator_to_array($el->childNodes) as $child) {
            self::sanitizeSvgNodeRecursive($doc, $child, $allowedTagsLower, $allowedAttrsLower);
        }
    }

    /**
     * Detekce nebezpečných hodnot v URL-atributech (javascript:, externí url(), nepovolené data:).
     * Povoluje url(#id) a bezpečné data:image/*.
     */
    private static function isDangerousUrlAttr(string $attrName, string $value): bool
    {
        $lname = strtolower($attrName);
        $val   = trim($value);

        if (preg_match('~^\s*javascript\s*:\s*~i', $val)) {
            return true;
        }

        $maybeUrlAttrs = [
            'href','src','xlink:href','filter','clip-path','mask','fill','stroke','marker-start','marker-mid','marker-end'
        ];

        if (in_array($lname, $maybeUrlAttrs, true)) {
            // url(...)
            if (preg_match('~url\(\s*([^)]+)\s*\)~i', $val, $m)) {
                $target = trim($m[1], '\'" ');
                if (!str_starts_with($target, '#')) return true;
            }
            // data:
            if (preg_match('~^\s*data:~i', $val)) {
                return !preg_match('~^\s*data:image/(png|jpe?g|gif|webp)\b~i', $val);
            }
            // externí http(s) → v SVG nepovolujeme
            if (preg_match('~^(https?:)?//~i', $val)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Pouze pro HTML: test, zda atribut představuje inline JS vektor.
     * – on* / javascript: / data: (mimo image/*) / style s url(javascript:...).
     * – HTTP(S) odkazy jsou povolené (na rozdíl od SVG sanitizace).
     */
    private static function isInlineJsVectorAttr(string $attrName, string $value): bool
    {
        $name = strtolower($attrName);
        $val  = trim($value);

        // inline eventy
        if (str_starts_with($name, 'on')) return true;

        // javascript: schéma
        if (preg_match('~^\s*javascript\s*:\s*~i', $val)) return true;

        // nebezpečné data:
        if (preg_match('~^\s*data:~i', $val) && !preg_match('~^\s*data:image/(png|jpe?g|gif|webp)\b~i', $val)) {
            return true;
        }

        // style="...url(javascript:...)" apod.
        if ($name === 'style' && preg_match_all('~url\(\s*([^)]+)\s*\)~i', $val, $m)) {
            foreach ($m[1] as $raw) {
                $target = trim((string)$raw, '\'" ');
                if (preg_match('~^\s*javascript\s*:\s*~i', $target)) return true;
                if (preg_match('~^\s*data:~i', $target) && !preg_match('~^\s*data:image/(png|jpe?g|gif|webp)\b~i', $target)) return true;
            }
        }

        // http(s) jsou OK
        return false;
    }

    /** Vyhodnocení CSS stylu, zda obsahuje url(...) s externím/JS cílem; povoluje url(#id). (aktuálně se nevolá – style zahazujeme) */
    private static function styleContainsExternalOrJsUrl(string $style): bool
    {
        if (preg_match_all('~url\(\s*([^)]+)\s*\)~i', $style, $all)) {
            foreach ($all[1] as $raw) {
                $target = trim((string)$raw, '\'" ');
                if (preg_match('~^\s*javascript\s*:\s*~i', $target)) return true;
                if (preg_match('~^(https?:)?//~i', $target)) return true;
                if (preg_match('~^\s*data:~i', $target) && !preg_match('~^\s*data:image/(png|jpe?g|gif|webp)\b~i', $target)) return true;
                if (!str_starts_with($target, '#')) return true;
            }
        }
        return false;
    }
}
