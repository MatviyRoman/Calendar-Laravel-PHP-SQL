<!DOCTYPE html>
<html>

<head>
    <title>@yield('title') | Roman Matviy</title>

    <!-- bootstarp -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />

    <!-- fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@200;300;400;600&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- page events or faq -->
    @if(request()->is('events') || request()->is('faq'))
        @vite(['resources/css/events.css'])
    @endif

    <!-- page events or calendar -->
    @if(request()->is('events') || request()->is('calendar'))
        <!-- jQuery -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

        <!-- toastr -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
        <script>
            function displayMessage(message, type = 1) {
                type === 1 ? toastr.success(message, 'Event') : toastr.error(message, 'Event');
            }
        </script>

        <!-- X-CSRF-TOKEN -->
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <script>
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
        </script>
    @endif

    <!-- page calendar -->
    @if(request()->is('calendar'))
        <!-- calendar -->
        <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.9/index.global.min.js"></script>

        <!-- event types -->
        @php
            $eventTypesArray = [];
            foreach ($eventTypes as $eventType) {
                $eventTypesArray[] = [
                    'id' => $eventType->id,
                    'class' => $eventType->class
                ];
            }
        @endphp

        <script>
            var eventTypesArray = @json($eventTypesArray);

            const SITEURL = "{{ url('/') }}";
        </script>

        @vite(['resources/css/calendar.css'])
        @vite(['resources/js/calendar.js'])
    @endif
</head>
<body>
    <x-header />

    <section>
        @yield('content')
    </section>

    <x-footer />

    <script>
        @yield('script')
    </script>
</body>
</html>
