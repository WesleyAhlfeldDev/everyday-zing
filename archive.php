<?php get_header(); ?>

<div class="container">

	<header class="page-header" style="margin-bottom: var(--space-12);">
		<?php
		if ( is_category() ) {
			echo '<h1 class="page-title">' . single_cat_title( '', false ) . '</h1>';
		} elseif ( is_tag() ) {
			echo '<h1 class="page-title">' . single_tag_title( __( 'Tag: ', 'everyday-zing-theme' ), false ) . '</h1>';
		} elseif ( is_author() ) {
			echo '<h1 class="page-title">' . get_the_author() . '</h1>';
		} elseif ( is_year() ) {
			echo '<h1 class="page-title">' . get_the_date( 'Y' ) . '</h1>';
		} elseif ( is_month() ) {
			echo '<h1 class="page-title">' . get_the_date( 'F Y' ) . '</h1>';
		} elseif ( is_day() ) {
			echo '<h1 class="page-title">' . get_the_date() . '</h1>';
		} else {
			echo '<h1 class="page-title">' . esc_html__( 'Archives', 'everyday-zing-theme' ) . '</h1>';
		}

		$archive_description = get_the_archive_description();
		if ( $archive_description ) {
			echo '<div class="archive-description" style="margin-top: var(--space-4); color: var(--color-text-muted);">' . wp_kses_post( $archive_description ) . '</div>';
		}
		?>
	</header>

	<?php if ( have_posts() ) : ?>

		<div class="posts-grid">
			<?php while ( have_posts() ) : the_post(); ?>
				<?php get_template_part( 'template-parts/post/content', get_post_type() ); ?>
			<?php endwhile; ?>
		</div>

		<?php the_posts_pagination( [
			'mid_size'  => 2,
			'prev_text' => '&larr;',
			'next_text' => '&rarr;',
			'class'     => 'pagination',
		] ); ?>

	<?php else : ?>

		<?php get_template_part( 'template-parts/post/content', 'none' ); ?>

	<?php endif; ?>

</div>

<?php get_footer(); ?>
