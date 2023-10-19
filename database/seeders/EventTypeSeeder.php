<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventTypeSeeder extends Seeder
{
    public function run()
    {
        $eventTypes = [
            ['name' => 'Meeting with an expert','class'=> 'meeting'],
            ['name' => 'Question-answer','class'=> 'question'],
            ['name' => 'Conference', 'class'=> 'conference'],
            ['name' => 'Webinar', 'class'=> 'webinar'],
        ];

        DB::table('event_types')->insert($eventTypes);
    }
}
