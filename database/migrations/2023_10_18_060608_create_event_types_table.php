<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventTypesTable extends Migration
{
    public function up()
    {
        Schema::create('event_types', function (Blueprint $table) {
            $table->id(); // Auto-incremental primary key
            $table->string('name'); // Name of the event type
            $table->string('class'); // Class of the event type
        });
    }

    public function down()
    {
        Schema::dropIfExists('event_types');
    }
}
