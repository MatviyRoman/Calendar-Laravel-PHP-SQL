<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class EventsSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();
        $startDate = $faker->dateTimeBetween('now', '+2 months');

        foreach (range(1, 100) as $index) {
            $date = $startDate->modify('+' . rand(1, 3) . ' day')->format('Y-m-d');

            DB::table('events')->insert([
                'title' => $faker->sentence,
                'description' => $faker->sentence,
                'start' => $date,
                'end' => $date,
                'location' => $faker->city,
                'time' => $faker->time,
                'event_type_id' => rand(1, 4),
            ]);
        }
    }
}
