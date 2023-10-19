@extends('layouts.app')

@section('title', 'Home')

@section('content')
    <section>
        <div class="events-wrapper container">
            <p><a href="{{ route('calendar') }}">Calendar</a></p>
        </div>
    </section>
@endsection
