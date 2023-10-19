<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\EventType;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'start',
        'end',
        'location',
        'time',
        'event_type_id',
    ];

    // Define the relationship to EventType
    public function eventType()
    {
        return $this->belongsTo(EventType::class);
    }
}
