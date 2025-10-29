<?php
// app/Models/Service.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    public $incrementing = false;
    public $timestamps = false;
    
    protected $fillable = [
        'id', // stejné ID jako page
        'category',
        'menu_icon_svg',
    ];

    /**
     * Page associated with this service (1:1 relationship)
     */
    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'id', 'id');
    }
}
