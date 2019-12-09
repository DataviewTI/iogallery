'use strict';
let mix = require('laravel-mix');

function IOGallery(params = {}) {
  let $ = this;
  let dep = {
    gallery: 'node_modules/intranetone-gallery/src/',
    moment: 'node_modules/moment/',
    momentdf: 'node_modules/moment-duration-format/lib/',
    sortable: 'node_modules/sortablejs/',
    cropper: 'node_modules/cropperjs/dist/',
    jquerycropper: 'node_modules/jquery-cropper/dist/',
    dropzone: 'node_modules/dropzone/dist/',
    photoswipe: 'node_modules/photoswipe/dist/'
  };

  let config = {
    optimize: false,
    sass: false,
    cb: () => {}
  };

  this.compile = (IO, callback = () => {}) => {
    mix.styles(
      [
        IO.src.css + 'helpers/dv-buttons.css',
        IO.src.io.css + 'dropzone.css',
        IO.src.io.css + 'dropzone-preview-template.css',
        IO.src.io.vendors +
          'aanjulena-bs-toggle-switch/aanjulena-bs-toggle-switch.css',
        IO.src.io.css + 'sortable.css',
        IO.dep.io.toastr + 'toastr.min.css',
        IO.src.io.css + 'toastr.css',
        dep.cropper + 'cropper.css',
        IO.src.io.root + 'forms/videos-form.css',
        dep.gallery + 'gallery.css'
      ],
      IO.dest.io.root + 'services/io-gallery.min.css'
    );

    mix.styles(
      [
        dep.photoswipe + 'photoswipe.css',
        IO.src.css + 'photoswipe-default-skin.css'
      ],
      IO.dest.io.root + 'services/io-gallery-ps.min.css'
    );

    mix.babel(
      [
        dep.sortable + 'Sortable.min.js',
        IO.src.io.vendors +
          'aanjulena-bs-toggle-switch/aanjulena-bs-toggle-switch.js',
        IO.dep.io.toastr + 'toastr.min.js',
        IO.src.io.js + 'defaults/def-toastr.js',
        dep.dropzone + 'dropzone.js',
        IO.src.io.js + 'dropzone-loader.js'
      ],
      IO.dest.io.root + 'services/io-gallery-babel.min.js'
    );

    mix.scripts(
      [
        dep.moment + 'min/moment.min.js',
        IO.src.io.vendors + 'moment/moment-pt-br.js',
        dep.momentdf + 'moment-duration-format.js',
        dep.cropper + 'cropper.js',
        dep.jquerycropper + 'jquery-cropper.js'
      ],
      IO.dest.io.root + 'services/io-gallery-mix.min.js'
    );

    //copy separated for compatibility
    mix.babel(
      dep.gallery + 'gallery.js',
      IO.dest.io.root + 'services/io-gallery.min.js'
    );

    callback(IO);
  };
}

module.exports = IOGallery;
