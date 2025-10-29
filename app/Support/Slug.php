<?php
// app/Support/Slug.php
declare(strict_types=1);

namespace App\Support;

final class Slug
{
    /** Povolit jen [A-Za-z0-9-], zákaz prázdných/tečkových segmentů. */
    public static function assert(string $slug): string
    {
        $s = trim($slug);
        if ($s === '' || $s === '.' || $s === '..') {
            throw new \InvalidArgumentException('Invalid slug segment.');
        }
        if (!preg_match('~^[a-z0-9-]+$~i', $s)) {
            throw new \InvalidArgumentException('Slug may contain only letters, numbers and dash.');
        }
        return $s;
    }
}
