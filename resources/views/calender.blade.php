@extends('layouts.app')

@section('title', 'Calendar')

@section('content')
    <div class="container">
        <h1 class="title">@yield('title')</h1>
        <div class="filter-wrapper" id="event-type-filter">

            @foreach($eventTypes as $eventType)
                <a href="#" data-id="{{ $eventType->id }}" class="btn {{ $eventType->class }}">{{ $eventType->name }}</a>
            @endforeach

        </div>
        <div id="calendar" class="calendar"></div>
        <div class="modalPlace"></div>
    </div>
@endsection
