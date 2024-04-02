const CALENDAR_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const CALENDAR_EVENTS = [
    {
      name: "Running",
      day: "wednesday",
      time: "09:00AM",
      modality: "In-person",
      location: "Boulder",
      url: "",
      attendees: "Alice, Jack, Ben",
    },
  ];
  

/* The function initializeCalendar() initializes the Calendar for your events and it gets called `onload` of your page.
We will complete the TODOs to render the Calendar in the next few steps. */
function initializeCalendar() {
    // You will be implementing this function in section 2: Create Modal
    initializeEventModal();
    // @TODO: Get the div of the calendar which we created using its id. Either use document.getElementById() or document.querySelector()
    const calendarElement = document.getElementById("calendar");
    // Iterating over each CALENDAR_DAYS
    CALENDAR_DAYS.forEach(day => {
      // @TODO: Create a bootstrap card for each weekday. Uncomment the below line and call createBootstrapCard(day) function.
      var card = createBootstrapCard(day);
      // @TODO: Add card to the calendarElement. Use appendChild()
      calendarElement.appendChild(card);

      // @TODO: Uncomment the below line and call createTitle(day) function.
      var title = createTitle(day);
      // @TODO: Add title to the card. Use appendChild()
      card.appendChild(title);
      // @TODO: Uncomment the below line and call createEventIcon(card) function.
      var icon = createEventIcon(card);
      // @TODO: Add icon to the title. Use appendChild()
      title.appendChild(icon);
      // @TODO: Uncomment the below line and and call createEventDiv() function.
      var eventsDiv = createEventDiv();
      // @TODO: Add eventsDiv to the card. Use appendChild()
      card.appendChild(eventsDiv);
      // @TODO: Do a console.log(card) to verify the output on your console.
      console.log(card);
      });
  
    // @TODO: Uncomment this after you implement the updateDOM() function
    updateDOM()
  }
  // end of initializeCalendar()

  function createBootstrapCard(day) {
    // @TODO: Use `document.createElement()` function to create a `div`
    var card = document.createElement('div');
    // Let's add some bootstrap classes to the div to upgrade its appearance
    // This is the equivalent of <div class="col-sm m-1 bg-white rounded px-1 px-md-2"> in HTML
    card.className = 'col-sm m-1 bg-white rounded px-1 px-md-2';
  
    // This the equivalent of <div id="monday"> in HTML
    card.id = day.toLowerCase();
    return card;
  }

  function createTitle(day) {
    // Create weekday as the title.
    // @TODO: Use `document.createElement()` function to create a `div` for title
    const title = document.createElement('div');
    title.className = 'h6 text-center position-relative py-2';
    title.innerHTML = day;
  
    return title;
  }

  function createEventIcon(card) {
    // @TODO: Use `document.createElement()` function to add an icon button to the card. Use `i` to create an icon.
    const icon = document.createElement('i');
    icon.className =
      'bi bi-calendar-plus btn position-absolute translate-middle start-100  rounded p-0 btn-link';
  
    // adding an event listener to the click event of the icon to open the modal
    // the below line of code would be the equivalent of:
    // <i onclick="openEventModal({day: 'monday'})"> in HTML.
    icon.setAttribute('onclick', `openEventModal({day: ${card.id}})`);
    return icon;
  }

  function createEventDiv() {
    //  @TODO: Use `document.createElement()` function to add a `div` to the weekday card, which will be populated with events later.
    const eventsDiv = document.createElement('div');
    // We are adding a class for this container to able to call it when we're populating the days
    // with the events
    eventsDiv.classList.add('event-container');
  
    return eventsDiv;
  }

  function initializeEventModal() {
    // @TODO: Create a modal using JS. The id will be `event-modal`:
    // Reference: https://getbootstrap.com/docs/5.3/components/modal/#via-javascript
    EVENT_MODAL = new bootstrap.Modal('#myModal');
  }

  function openEventModal({id, day}) {
    EVENT_MODAL.show();
  }

  function updateLocationOptions() {
    var modality = document.getElementById('event_modality').value;
    var locationField = document.getElementById('locationField');
    var remoteUrlField = document.getElementById('remoteUrlField');
  
    if (modality === 'In-Person') {
      locationField.style.display = '';
      remoteUrlField.style.display = 'none';
    } else if (modality === 'Remote') {
      locationField.style.display = 'none';
      remoteUrlField.style.display = '';
    } else {
      locationField.style.display = 'none';
      remoteUrlField.style.display = 'none';
    }
  }

  function createEventElement(id) {
    // @TODO: create a new div element. Use document.createElement().
    var eventElement = document.createElement('div');
    // Adding classes to the <div> element.
    eventElement.classList = "event row border rounded m-1 py-1";
    // @TODO: Set the id attribute of the eventElement to be the same as the input id.
    // Replace <> with the correct HTML attribute
    eventElement.id = `event-${id}`;
    return eventElement;
  }

  function createTitleForEvent(event) {
    var title = document.createElement('div');
    title.classList.add('col', 'event-title');
    title.innerHTML = event.name;
    return title;
  }

  function updateDOM() {
    const events = CALENDAR_EVENTS;
  
    events.forEach((event, id) => {
      // First, let's try to update the event if it already exists.
  
      // @TODO: Use the `id` parameter to fetch the object if it already exists.
      // Replace <> with the appropriate variable name
      // In templated strings, you can include variables as ${var_name}.
      // For eg: let name = 'John';
      // let msg = `Welcome ${name}`;
      let eventElement = document.querySelector(`#event-id`);
  
      // if event is undefined, i.e. it doesn't exist in the CALENDAR_EVENTS array, make a new one.
      if (eventElement === null) {
        eventElement = createEventElement(id);
        const title = createTitleForEvent(event);
        // @TODO: Append the title to the event element. Use .append() or .appendChild()
        eventElement.appendChild(title);
      } else {
        // @TODO: Remove the old element while updating the event.
        // Use .remove() with the eventElement to remove the eventElement.
        eventElement.remove;
        eventElement = createEventElement(id);
        const title = createTitleForEvent(event);
        eventElement.appendChild(title);

      }
  
      // Add the event name
      const title = eventElement.querySelector('div.event-title');
      title.innerHTML = event.name;
  
      // Add a tooltip with more information on hover
      // @TODO: you will add code here when you are working on for Part C.
  
      // @TODO: On clicking the event div, it should open the modal with the fields pre-populated.
      // Replace "<>" with the triggering action.
      eventElement.setAttribute('onclick', `openEventModal({id: ${id}})`);
  
      // Add the event div to the parent
      document
        .querySelector(`#${event.day} .event-container`)
        .appendChild(eventElement);
    });
  
    //updateTooltips(); // Declare the function in the script.js. You will define this function in Part B.
  }
  
