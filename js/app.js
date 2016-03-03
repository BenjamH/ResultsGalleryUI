$(document).ready(function() {

  // foundation css framework
  $(document).foundation();

  // create controller
  C = new Controller();
  C.processRequest();
  C.initLoadHandler();

});

// MODEL

function Server(){
  this.photosUrl = 'http://jsonplaceholder.typicode.com/photos';
  this.config = {
    url: this.photosUrl,
    dataType: 'json',
    beforeSend: function(){
      $('button').hide();
      $('.fa-spinner').removeClass('hide');
    }
  };
};

Server.prototype.makePhotosRequest = function() {
  var requestObject = $.ajax(this.config);
  return requestObject;
};

// CONTROLLER

function Controller(){
  this.server = new Server;
  this.view = new View;
};

Controller.prototype.initLoadHandler = function() {
  self = this;
  $('button').click(function(e) {
    e.preventDefault();
    self.processRequest();
  });
};

Controller.prototype.serverRequest = function() {
  return this.server.makePhotosRequest();
};

Controller.prototype.processRequest = function() {
  var self = this;
  var request = this.serverRequest();

  request.done(function(data) {
    var html = self.view.compileTemplate(data);
    self.view.render(html);
  });

  request.fail(function(){
    console.log('fail');
  });

  request.complete(function(){
    $('button').show();
    $('.fa-spinner').addClass('hide');
  });
};

// VIEW

function View() {
  this.albumsLoaded = 0;
};

// could use a templating engine like mustache or handlebars to separate view model logic.

View.prototype.compileTemplate = function(results) {
  var html = "";

  for ( var i = this.albumsLoaded; i < this.albumsLoaded + 6; i++) {
    var album = results[i];
    var score = Math.floor(Math.random() * 100) + 1;

    html += "<div data-id=" + album.album_id + " class='column overlay-container'>";
    html += "<a href='" + album.url + "' target=_blank>";
    html += "<img class='thumbnail' src='" + album.thumbnailUrl + "' />";
    html += "</a>";
    html += "<div class='overlay score'>" + "<span>" + score + "</span>" + "</div>";
    html += "</div>";
  };
  this.albumsLoaded+= 6;
  return html;
};

View.prototype.render = function(html){
  var $resultsEl = $('#album-results');
  $resultsEl.append(html);
};