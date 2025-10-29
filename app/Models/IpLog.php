<?php
// app/Models/IpLog.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IpLog extends Model
{
    use HasFactory;

    protected $table = 'ip_logs';

    protected $fillable = [
        'ip',
        'route',
        'success',
        'reason',
        'user_agent',
    ];

    protected $casts = [
        'success' => 'boolean',
    ];

    public function contactMessages(): HasMany
    {
        return $this->hasMany(ContactMessage::class, 'ip_log_id');
    }
}
