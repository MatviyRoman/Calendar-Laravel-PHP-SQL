@extends('layouts.app')

@section('title', 'Events')

@section('content')
    <section>
        <div class="events-wrapper container">
            @if($events->isEmpty())
                <p>No events to display. <br>Please run this command "<span class="red">php artisan db:seed</span>"</p>
                <p>Or click this button<button id="seedDatabaseBtn" class="ml-3 btn btn-success">Seed Database</button></p>
            @else
                @foreach ($events as $event)
                    <div class="event-container">
                        <h2 class="event-title">Title: {{ $event->title }}</h2>
                        <p class="event-description">Description: {{ $event->description }}</p>
                        <p class="event-location">Location: {{ $event->location }}</p>
                        <p class="event-date">Start Date: {{ $event->start }}</p>
                        <p class="event-date">End Date: {{ $event->end }}</p>
                        <p class="event-time">Time: {{ $event->time }}</p>
                        <p class="event-type {{ $event->eventType->class }}">Event type: {{ $event->eventType->name }}</p>
                    </div>
                @endforeach
                {{ $events->links() }}
            @endif
        </div>
    </section>
@endsection

@section('script')
    // Function to handle the button click event
    function seedDatabase() {
        // Send an AJAX request to run the db:seed command
        $.ajax({
        type: "POST",
        url: "/seed-database", // Replace with the appropriate route
        success: function(response) {
            // Handle success (e.g., show a success message)
            displayMessage("Database seeded successfully!");

            setTimeout(function() {
                location.reload();
            }, 2000);
        },
        error: function(xhr, status, error) {
            // Handle errors (e.g., show an error message)
            displayMessage("Error seeding the database: " + error, 2);
        }
        });
    }

    // Attach the click event handler to the button
    $("#seedDatabaseBtn").click(seedDatabase);
@endsection
