<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGalleriesTable extends Migration
{
    public function up()
    {
			Schema::create('galleries', function(Blueprint $table)
			{
				$table->increments('id');
				$table->string('title');
				$table->mediumText('sizes')->nullable();
				$table->boolean('featured')->default(false);
        $table->text('description')->nullable();
				$table->dateTime('date_start');
				$table->dateTime('date_end')->nullable();
        $table->integer('group_id')->unsigned()->nullable();
        $table->timestamps();
				$table->softDeletes();
        $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade')->onUpdate('cascade');
			});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('galleries');
    }
}
