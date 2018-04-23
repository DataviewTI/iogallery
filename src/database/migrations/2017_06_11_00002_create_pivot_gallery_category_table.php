<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePivotGalleryCategoryTable extends Migration
{
    public function up()
    {
        Schema::create('gallery_category', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('gallery_id')->unsigned();
            $table->integer('category_id')->unsigned();
            $table->boolean('main')->default(false);
            $table->timestamps();
            $table->foreign('gallery_id')->references('id')->on('galleries')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade')->onUpdate('cascade');
        });
    }
    public function down()
    {
        Schema::dropIfExists('gallery_category');
    }
}
