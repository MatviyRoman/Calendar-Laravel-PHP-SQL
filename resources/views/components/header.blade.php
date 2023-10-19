<header class="header">
    <div class="container">
        <div class="d-flex justify-content-between align-items-center header_wrapper">
            <div class="col-3 p-0 logo-wrapper"><a href="{{ route('calendar') }}" class="logo">{{ __('menu.logo') }}</a></div>
            <nav class="col-auto p-0 nav">
                <ul class="items">
                    <li class="item"><a href="{{ route('home') }}" class="{{ Request::is('/') ? 'active' : '' }}">{{ __('menu.main') }}</a></li>
                    <li class="item"><a href="{{ route('events') }}" class="{{ Request::is('events') ? 'active' : '' }}">{{ __('menu.events') }}</a></li>
                    <li class="item"><a href="{{ route('calendar') }}" class="{{ Request::is('calendar') ? 'active' : '' }}">{{ __('menu.calendar') }}</a></li>
                    <li class="item"><a href="{{ route('faq') }}" class="{{ Request::is('faq') ? 'active' : '' }}">{{ __('menu.faq') }}</a></li>
                </ul>
            </nav>
        </div>
    </div>
</header>
