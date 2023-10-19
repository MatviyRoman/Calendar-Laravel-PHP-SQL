document.addEventListener('DOMContentLoaded', function() {
    /* modal remove */
    $('.modalPlace').on('click', '.modal .close', function(e) {
        $('.modal').remove();
    });

    /* Event add */
    $('.modalPlace').on('click', '.add', function(e) {
        e.preventDefault();

        const date = $(this).data('date');

        addEvent(date);
        $('.showEventsModal').remove();
    });

    /* Event save */
    $('.modalPlace').on('click', '.save', function(e) {
        e.preventDefault();

        const title = $('#addEventForm #name').val();
        const description = $('#addEventForm #description').val();
        const location = $('#addEventForm #location').val();
        const date = $('#addEventForm #event_date').val();
        const time = $('#addEventForm #event_time').val();
        const event_type_id = $("#event_type").val();

        $.ajax({
            url: SITEURL + "/calendar/ajax",

            data: {
                title: title,
                description: description,
                location: location,
                start: date,
                end: date,
                time: time,
                event_type_id: event_type_id,
                type: 'add'
            },

            type: "POST",

            success: function(data) {
                displayMessage("Event Created Successfully");
                calendar.removeAllEvents();
                calendar.unselect();
                calendar.refetchEvents();
                $('#addEventModal').remove();
                $('.filter-wrapper a').removeClass('active');
            },

            error: function(xhr, status, errors) {
                console.log("Error: " + errors);
                displayMessage('fill in all fields', 2);
            }
        });
    });

    /* Event edit */
    $('.modalPlace').on('click', '.edit', function(e) {
        e.preventDefault();
        const event_id = $(this).data('id');

        showEditEventModal(event_id);
        $('.showEventsModal').remove();
    });

    /* Event delete */
    $('.modalPlace').on('click', '.delete', function(e) {
        e.preventDefault();
        let event_id = $(this).data('id');

        //calendar.refetchEvents();

        calendar.unselect();
        calendar.getEventById(event_id).remove();
        deleteEvent(event_id);
        $('.modal').remove();
    });

    /* Event update */
    $('.modalPlace').on('click', '.update', function(e) {
        e.preventDefault();
        const event_id = $(this).data('id');
        const title = $('#editEventForm #name').val();
        const description = $('#editEventForm #description').val();
        const location = $('#editEventForm #location').val();
        const date = $('#editEventForm #event_date').val();
        const time = $('#editEventForm #event_time').val();
        const event_type_id = $("#event_type").val();

        $.ajax({
            url: SITEURL + "/calendar/ajax",

            data: {
                id: event_id,
                title: title,
                description: description,
                location: location,
                start: date,
                end: date,
                time: time,
                event_type_id: event_type_id,
                type: 'update'
            },

            type: "POST",

            success: function(data) {
                displayMessage("Event Created Successfully");
                calendar.removeAllEvents();
                calendar.unselect();
                calendar.refetchEvents();
                $('.modal').remove();
                $('.filter-wrapper a').removeClass('active');
            },

            error: function(xhr, status, errors) {
                console.log("Error: " + errors);
                displayMessage('fill in all fields', 2);
            }
        });
    });

    // Select all the links within the filter-wrapper
    $('.filter-wrapper a').click(function(e) {
        e.preventDefault(); // Prevent the default link behavior

        const selectedEventType = $(this).data('id');

        // Get data with filter even type
        $.ajax({
            url: '/calendar/filter',
            data: { eventType: selectedEventType },
            success: function(data) {
                calendar.removeAllEvents();
                calendar.addEventSource(data);
            }
        });

        // Remove the "active" class from all links
        $('.filter-wrapper a').removeClass('active');

        // Add the "active" class to the clicked link
        $(this).addClass('active');
    });

    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: 'UTC',
        initialView: 'multiMonth',
        headerToolbar: false,
        duration: {
            months: 6
        },
        events: SITEURL + "/calendar",
        displayEventTime: false,
        editable: false,
        eventOverlap: false,
        selectable: true,
        selectMirror: false,

        select: function(info) {
            const start = info.startStr;
            const end = info.endStr;

            displayModalEvents(start, end);
        },

        selects: function(info) {
            const title = prompt('Event Title:');

            if (title) {
                $.ajax({
                    url: SITEURL + "/calendar/ajax",

                    data: {
                        title: title,
                        start: start.startStr,
                        end: start.endStr,
                        type: 'add'
                    },

                    type: "POST",

                    success: function(data) {
                        displayMessage("Event Created Successfully");
                        calendar.addEvent({
                            id: data.id,
                            title: title,
                            start: start,
                            end: end,
                            allDay: allDay
                        });

                        calendar.removeAllEvents();
                        calendar.unselect();
                        calendar.refetchEvents();
                    }
                });
            }
        },

        eventContent: function(info) {
            let {allDay} = info.event._def.allDay;

            if (allDay === 'true') {
                allDay = true;
            } else {
                allDay = false;
            }

            let type_id = info.event._def.extendedProps.event_type_id;
            let type_class = eventTypesArray[--type_id].class;
            let content = `<div class="event-content circle ${type_class}">`;
            content += '</div>';

            return { html: content };
        },

        eventDrop: function(event) {
            const start = $.fullCalendar.formatDate(event.start, "Y-MM-DD");
            const end = $.fullCalendar.formatDate(event.end, "Y-MM-DD");

            $.ajax({
                url: SITEURL + '/calendar/ajax',
                data: {
                    title: event.title,
                    start: start,
                    end: end,
                    id: event.id,
                    type: 'update'
                },

                type: "POST",

                success: function(response) {
                    displayMessage("Event Updated Successfully");
                }
            });
        },

        eventClick: function(event) {
            const deleteMsg = confirm("Do you really want to delete?");

            if (deleteMsg) {
                $.ajax({
                    type: "POST",
                    url: SITEURL + '/calendar/ajax',
                    data: {
                        id: event.event._def.publicId,
                        type: 'delete'
                    },

                    success: function(response) {
                        calendar.getEventById(event.event._def.publicId).remove();
                        displayMessage("Event Deleted Successfully", 2);
                    }
                });
            }
        }
    });

    calendar.render();
});

/* display modal events */
function displayModalEvents(start, end) {
    $.ajax({
        url: SITEURL + "/calendar/ajax",

        data: {
            start: start,
            end: end,
            type: 'allDay'
        },

        type: "POST",

        success: function(events) {
            showModalEvents(events, start);
        }
    });
}

/* show modal events */
function showModalEvents (events, start) {
    let items = '';

    events.forEach(item => {
        items += eventItem(item);
    });

    if(!items) {
        items += '<p class="text-danger">No events to display.</p>';
    }

    let EventShowHTML = `
        <div class="modal fade showEventsModal" id="showEventsModal" tabindex="-1" role="dialog" aria-labelledby="editEventModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editEventModalLabel">Events</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${items}
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary add" data-dismiss="modal" data-date="${start}">Add event</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('.modalPlace').append(EventShowHTML);
    $('#showEventsModal').show().removeClass('fade');
}

/* item event */
function eventItem(event) {
    let card_id = event.id;
    let title = event.title;
    let description = event.description;
    let location = event.location;
    let time = event.time;
    let event_type = event.event_type.name;
    let event_class = event.event_type.class;

    var event_html = `
    <div class="card">
        <h2 class="card-title">${title}<p class="icon edit" data-id="${card_id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.53999 21.0469C4.92999 21.0469 4.35999 20.8369 3.94999 20.4469C3.42999 19.9569 3.17999 19.2169 3.26999 18.4169L3.63999 15.1769C3.70999 14.5669 4.07999 13.7569 4.50999 13.3169L11.3421 6.08541C11.3534 6.07256 11.3652 6.06008 11.3774 6.04799L12.72 4.62692C14.77 2.45692 16.91 2.39692 19.08 4.44692C21.25 6.49692 21.31 8.63692 19.26 10.8069L11.05 19.4969C10.63 19.9469 9.84999 20.3669 9.23999 20.4669L6.01999 21.0169C5.95895 21.0205 5.9005 21.0254 5.84324 21.0302C5.74099 21.0387 5.64254 21.0469 5.53999 21.0469ZM5.59999 14.3369L11.5184 8.0653C12.258 10.0344 13.8657 11.5562 15.8709 12.1898L9.94999 18.4569C9.74999 18.6669 9.26999 18.9269 8.97999 18.9769L5.75999 19.5269C5.42999 19.5769 5.15999 19.5169 4.97999 19.3469C4.79999 19.1769 4.71999 18.9069 4.75999 18.5769L5.12999 15.3369C5.16999 15.0469 5.39999 14.5469 5.59999 14.3369ZM18.16 9.76692L17.055 10.9366C14.9019 10.5714 13.1855 8.93318 12.7129 6.79952L13.81 5.63692C14.49 4.91692 15.16 4.43692 15.93 4.43692C16.55 4.43692 17.24 4.75692 18.04 5.52692C19.85 7.22692 19.4 8.44692 18.16 9.76692Z" fill="#797979"/>
        </svg></p></h2>
        <p class="card-description">${description}</p>
        <p class="card-location">${location}</p>
        <div class="card__footer ${event_class}">
            <p class="card-time">${time}</p>
            <p class="card-type">${event_type}</p>
        </div>
    </div>
    `;

    return event_html;
}

/* show edit event */
function showEditEventModal(event_id) {
    $.ajax({
        url: SITEURL + "/calendar/ajax",

        data: {
            id: event_id,
            type: 'edit'
        },

        type: "POST",

        success: function(event) {
            editEvent(event);
        }
    });
}

/* delete event */
function deleteEvent(event_id) {
    $.ajax({
        type: "POST",
        url: SITEURL + '/calendar/ajax',
        data: {
            id: event_id,
            type: 'delete'
        },

        success: function(response) {
            displayMessage("Event Deleted Successfully", 2);
        }
    });
}

/* edit event */
function editEvent(event) {
    const event_id = event.id;
    const title = event.title;
    const description = event.description;
    const event_datetime = event.start;
    const location = event.location;
    const event_type = event.event_type.name;
    const event_type_id = event.event_type.id;
    let time = event.time;
    let timeParts = time.split(":");
    time = timeParts[0] + ":" + timeParts[1]; //! remove seconds

    const event_date = event.start;

    const editEventFormHTML = `
      <div class="modal fade" id="editEventModal" tabindex="-1" role="dialog" aria-labelledby="editEventModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editEventModalLabel">Edit event</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form id="editEventForm">
                <input type="hidden" name="event_id" value="${event_id}">
                <div class="form-group">
                  <label for="name">Event name</label>
                  <input type="text" class="form-control" id="name" name="name" value="${title}" required>
                </div>
                <div class="form-group">
                  <label for="description">Description</label>
                  <textarea class="form-control" id="description" name="description" required>${description}</textarea>
                </div>
                <div class="form-group d-none">
                  <label for="event_date">Date</label>
                  <!--<input type="datetime-local" class="form-control" id="event_datetime" name="event_datetime" value="${event_datetime}" required>-->
                  <input type="date" class="form-control" id="event_date" name="event_date" value="${event_date}" required>
                </div>
                <div class="form-group">
                  <label for="event_time">Time</label>
                  <!--<input type="datetime-local" class="form-control" id="event_datetime" name="event_datetime" value="${event_datetime}" required>-->
                  <input type="time" class="form-control" id="event_time" name="event_time" value="${time}" required>
                </div>
                <div class="form-group">
                  <label for="location">Location</label>
                  <input type="text" class="form-control" id="location" name="location" value="${location}" required>
                </div>
                <div class="form-group">
                  <label for="event_type">Type event</label>
                  <select class="form-control" id="event_type" name="event_type" required>
                    <option value="1">Meeting with an expert</option>
                    <option value="2">Question-answer</option>
                    <option value="3">Conference</option>
                    <option value="4">Webinar</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary close" data-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-danger delete" data-id="${event_id}">Delete</button>
              <button type="submit" class="btn btn-primary update" data-id="${event_id}">Save</button>
            </div>
          </div>
        </div>
      </div>
    `;

$('.modalPlace').append(editEventFormHTML);
$('#editEventModal').show().removeClass('fade');
}

/* add event */
function addEvent(date) {
    const currentTime = getCurrentTime();
    const userPlace = 'Ukraine';

    const addEventFormHTML = `
      <div class="modal fade" id="addEventModal" tabindex="-1" role="dialog" aria-labelledby="editEventModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editEventModalLabel">Add event</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form id="addEventForm">
                <div class="form-group">
                  <label for="name">Event title</label>
                  <input type="text" class="form-control" id="name" name="name" required>
                </div>
                <div class="form-group">
                  <label for="description">Description</label>
                  <textarea class="form-control" id="description" name="description" required></textarea>
                </div>
                <div class="form-group">
                  <label for="event_date">Data</label>
                  <input type="date" class="form-control" id="event_date" name="event_date" value="${date}" required>
                </div>
                <div class="form-group">
                  <label for="event_time">Time</label>
                  <input type="time" class="form-control" id="event_time" name="event_time" value="${currentTime}" required>
                </div>
                <div class="form-group">
                  <label for="location">Location</label>
                  <input type="text" class="form-control" id="location" name="location" value="${userPlace}" required>
                </div>
                <div class="form-group">
                  <label for="event_type">Type event</label>
                  <select class="form-control" id="event_type" name="event_type" required>
                    <option value="1">Meeting with an expert</option>
                    <option value="2">Question-answer</option>
                    <option value="3">Conference</option>
                    <option value="4">Webinar</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary close" data-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-danger save">Add</button>
            </div>
          </div>
        </div>
      </div>
    `;

    $('.modalPlace').append(addEventFormHTML);
    $('#addEventModal').show().removeClass('fade');
}

// Get user current time
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
