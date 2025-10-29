<?php
// app/Models/Reference.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reference extends Model
{
    protected $fillable = [
        'logo', 'logo_alt', 'title', 'description', 'tag',
    ];
}
