<?php get_header(); ?>

<div class="container container--narrow">

	<?php while ( have_posts() ) : the_post(); ?>

		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

			<header class="entry-header">
				<?php if ( ! is_front_page() ) : ?>
					<h1 class="entry-title"><?php the_title(); ?></h1>
				<?php endif; ?>
			</header>

			<div class="entry-content">
				<?php
				the_content();
				wp_link_pages( [ 'before' => '<div class="page-links">' . __( 'Pages:', 'everyday-zing-theme' ), 'after' => '</div>' ] );
				?>
			</div>

		</article>

		<?php if ( comments_open() || get_comments_number() ) : ?>
			<?php comments_template(); ?>
		<?php endif; ?>

	<?php endwhile; ?>

</div>

<?php get_footer(); ?>
