<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;
use Illuminate\Http\JsonResponse;

use App\Models\Event;
use App\Models\EventType;

class CalenderController extends Controller
{
    /**
     * Handle the initial view and AJAX requests for events.
     *
     * @param Request $request
     *
     * @return response()
     */

    public function index(Request $request): View|JsonResponse
    {
        if ($request->ajax() || $request->start) {
            $data = Event::whereDate('start', '>=', $request->start)
                ->whereDate('end', '<=', $request->end)
                ->with('eventType')
                ->get(['id', 'title', 'description', 'start', 'end', 'location', 'time', 'event_type_id']);

            return response()->json($data);
        }

        $eventTypes = EventType::all();

        return view('calender', compact('eventTypes'));
    }

    /**
     * Handle AJAX requests for adding, updating, and deleting events.
     *
     * @param Request $request
     * @return response()
     */

    public function ajax(Request $request): JsonResponse
    {
        switch ($request->type) {
            case 'add':
                $validatedData = $request->validate([
                    'title' => 'required|string|max:255',
                    'description' => 'required|string',
                    'start' => 'required|date',
                    'end' => 'required|date',
                    'location' => 'required|string',
                    'time' => 'required|date_format:H:i',
                    'event_type_id' => [
                        'required',
                        Rule::exists(EventType::class, 'id'),
                    ],
                ]);

                $event = Event::create($validatedData);

                return response()->json($event);
            break;

            case 'update':
                $validatedData = $request->validate([
                    'title' => 'required|string|max:255',
                    'description' => 'required|string',
                    'start' => 'required|date',
                    'end' => 'required|date',
                    'location' => 'required|string',
                    'time' => 'required|date_format:H:i',
                    'event_type_id' => [
                        'required',
                        Rule::exists(EventType::class, 'id'),
                    ],
                ]);

                $event = Event::find((int) $request->id)->update($validatedData);

                if (!$event) {
                    return response()->json(['message' => 'Event not found'], 404);
                }

                return response()->json($validatedData);
            break;

            case 'delete':
                $event = Event::find((int) $request->id)->delete();

                return response()->json($event);
            break;

            case 'edit':
                $event = Event::with('eventType')->find((int) $request->id);

                return response()->json($event);
            break;

            case 'allDay':
                $events = Event::where('start', $request->start)->with('eventType')->get();

                return response()->json($events);
            break;

            default:
                # default code...
            break;
        }
    }

    /**
     * Display a paginated list of events.
     *
     * @param Request $request
     * @return \Illuminate\Contracts\View\View
     */
    public function events(Request $request): View
    {
        $events = Event::paginate(5);

        return view('events', compact('events'));
    }

    /**
     * Display a paginated list of events.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function home(): View
    {
        return view('home');
    }

    /**
     * Filter events based on event type.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function filter(Request $request): JsonResponse
    {
        $eventType = $request->input('eventType');

        if (!$eventType) {
            $events = Event::all()->with('eventType');
        } else {
            $events = Event::where('event_type_id', $eventType)->with('eventType')->get();
        }

        return response()->json($events);
    }
}
