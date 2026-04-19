<?php get_header(); ?>

<div class="container">

	<header class="page-header" style="margin-bottom: var(--space-12);">
		<h1 class="page-title">
			<?php
			printf(
				/* translators: %s: search query */
				esc_html__( 'Results for: %s', 'everyday-zing-theme' ),
				'<span>' . get_search_query() . '</span>'
			);
			?>
		</h1>
	</header>

	<?php if ( have_posts() ) : ?>

		<div class="posts-grid">
			<?php while ( have_posts() ) : the_post(); ?>
				<?php get_template_part( 'template-parts/post/content', 'excerpt' ); ?>
			<?php endwhile; ?>
		</div>

		<?php the_posts_pagination( [
			'mid_size'  => 2,
			'prev_text' => '&larr;',
			'next_text' => '&rarr;',
			'class'     => 'pagination',
		] ); ?>

	<?php else : ?>

		<p><?php esc_html_e( 'No results found. Try a different search term.', 'everyday-zing-theme' ); ?></p>
		<?php get_search_form(); ?>

	<?php endif; ?>

</div>

<?php get_footer(); ?>
