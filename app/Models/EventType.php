<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Event;

class EventType extends Model
{
    use HasFactory;

    protected $table = 'event_types';

    protected $fillable = [
        'name',
        'class',
    ];

    // Define the relationship to Event
    public function event()
    {
        return $this->hasMany(Event::class);
    }
}
