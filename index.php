<?php get_header(); ?>

<div class="container py-5">

	<?php if ( have_posts() ) : ?>

		<?php if ( is_home() && ! is_front_page() ) : ?>
			<h1 class="mb-5"><?php single_post_title(); ?></h1>
		<?php endif; ?>

		<div class="row g-4">
			<?php while ( have_posts() ) : the_post(); ?>
				<div class="col-md-6 col-lg-4">
					<?php get_template_part( 'template-parts/post/content', get_post_type() ); ?>
				</div>
			<?php endwhile; ?>
		</div>

		<div class="mt-5">
			<?php the_posts_pagination( [ 'mid_size' => 2, 'prev_text' => '&larr;', 'next_text' => '&rarr;' ] ); ?>
		</div>

	<?php else : ?>
		<?php get_template_part( 'template-parts/post/content', 'none' ); ?>
	<?php endif; ?>

</div>

<?php get_footer(); ?>
