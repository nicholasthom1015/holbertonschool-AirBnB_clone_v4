#!/usr/bin/node
// Execute only when DOM is loaded
// Listen for changes on each input checkbox tag:
// if the checkbox is checked, you must store the Amenity ID in a variable (dictionary or list)
// if the checkbox is unchecked, you must remove the Amenity ID from the variable
// update the h4 tag inside the div Amenities with the list of Amenities checked

const api_URL = 'http://' + window.location.hostname + ':5001/api/v1/';

// Create empty object to store amenities
let checkedAmenities = {};

window.onload = function() {


  // Listen for changes on each input checkbox
  $('input[type="checkbox"]').on('change', function() {
    console.log("POP!")
    console.log($(this).data('id'));
    let myID = $(this).data('id');
    let myName = $(this).data('name');

    if ($(this).is(':checked')) {
      checkedAmenities[myID] = myName;
    } else {
      if (checkedAmenities[myID]) {
      delete checkedAmenities[myID];}
    }

    let amenitiyList = Object.values(checkedAmenities).join(', ');
    $('.amenities h4').text(amenitiyList);
  });
};

//populate Places
$.ajax({
  url: api_URL+'places_search/',
  type: 'POST',
  data: '{}',
  contentType: 'application/json',
  success: buildPlaces
});

// Get status from API. If OK, add Class 'available', if not, remove Class 'available'
$(function () {
  $.get(api_URL+'status', function(data) {
    const apiStatusDiv = $('#api_status');
    if (data.status === 'OK') {
      apiStatusDiv.addClass('available');
    } else {
      apiStatusDiv.removeClass('available');
    }
  });
});

function makePlural (value) {
  if (value === 1)
    return '';
  return 's';
}

$(document).ready(function () {
  $('button').on('click', function() {
    console.log('hello');
    $('.places > article').remove();
    $.ajax({
      url: api_URL+'places_search/',
      type: 'POST',
      data: JSON.stringify({ amenities: checkedAmenities }),
      contentType: 'application/json',
      success: buildPlaces
    });
  });
});


function buildPlaces (places) {
  $.get(api_URL+'users', function(users) {
    for (const place of places) {
      let user = users.filter(u => u.id === place.user_id)[0]; 

      $('section.places').append(`<article>
        <div class="title_box">
          <h2>${ place.name }</h2>
          <div class="price_by_night">$${ place.price_by_night }</div>
        </div>
        <div class="information">
          <div class="max_guest">${ place.max_guest } Guest${makePlural(place.max_guest)}</div>
                <div class="number_rooms">${ place.number_rooms } Bedroom${makePlural(place.number_rooms)}</div>
                <div class="number_bathrooms">${ place.number_bathrooms } Bathroom${makePlural(place.number_bathrooms)}</div>
        </div>
        <div class="user">
                <b>Owner:</b> ${ user.first_name } ${ user.last_name }
              </div>
              <div class="description">
          ${ place.description }
              </div>
      </article>`);
    }
  });
}