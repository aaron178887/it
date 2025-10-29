<?php
// app/Models/ContactMessage.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'message',
        'user_agent',
        'ip_log_id', 
    ];

    public function ipLog(): BelongsTo
    {
        return $this->belongsTo(IpLog::class, 'ip_log_id');
    }
}
