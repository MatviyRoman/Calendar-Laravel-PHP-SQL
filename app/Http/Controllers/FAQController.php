<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class FAQController extends Controller
{
    /**
     * Display the FAQ page.
     *
     * @return View
     */
    public function index(): View
    {
        return view('faq');
    }
}
