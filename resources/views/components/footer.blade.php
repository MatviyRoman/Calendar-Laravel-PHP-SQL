<footer class="footer pt-3 pb-3">
    <div class="container">
        <div class="footer_wrapper">
            <div class="col-12 p-0 logo-wrapper"><a href="{{ route('home') }}" class="logo">{{ __('menu.logo') }}</a></div>
            <nav class="col-12 p-0 nav">
                <ul class="items">
                    <li class="item"><a href="{{ route('home') }}" class="{{ Request::is('home') ? 'active' : '' }}">{{ __('menu.main') }}</a></li>
                    <li class="item"><a href="{{ route('events') }}" class="{{ Request::is('events') ? 'active' : '' }}">{{ __('menu.events') }}</a></li>
                    <li class="item"><a href="{{ route('calendar') }}" class="{{ Request::is('calendar') ? 'active' : '' }}">{{ __('menu.calendar') }}</a></li>
                    <li class="item"><a href="{{ route('faq') }}" class="{{ Request::is('faq') ? 'active' : '' }}">{{ __('menu.faq') }}</a></li>
                </ul>
            </nav>
        </div>
        <div class="copyright">
            &copy; {{ date('Y') }} All rights reserved
        </div>
    </div>
</footer>
