<?php
// app/Models/Page.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Page extends Model
{
    protected $fillable = [
        'slug',
        'data',
        'is_published',
    ];

    protected $casts = [
        'data' => 'array',
        'is_published' => 'boolean',
    ];

    /**
     * Service linked to this page (1:1 relationship)
     */
    public function service(): HasOne
    {
        return $this->hasOne(Service::class, 'id', 'id');
    }
}
