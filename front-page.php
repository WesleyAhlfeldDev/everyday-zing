<?php
/**
 * Front page template — full-width, no container wrapper.
 * Build the homepage by adding blocks in the editor.
 */
get_header();

while ( have_posts() ) :
	the_post();
	the_content();
endwhile;

get_footer();
