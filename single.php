<?php get_header(); ?>

<div class="container container--narrow">

	<?php while ( have_posts() ) : the_post(); ?>

		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

			<header class="entry-header">

				<?php
				$categories = get_the_category();
				if ( $categories ) :
				?>
					<a class="post-card__category" href="<?php echo esc_url( get_category_link( $categories[0]->term_id ) ); ?>">
						<?php echo esc_html( $categories[0]->name ); ?>
					</a>
				<?php endif; ?>

				<h1 class="entry-title"><?php the_title(); ?></h1>

				<div class="entry-meta">
					<span><?php echo get_avatar( get_the_author_meta( 'ID' ), 28, '', '', [ 'class' => 'entry-meta__avatar' ] ); ?></span>
					<span><?php the_author_posts_link(); ?></span>
					<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
						<?php echo esc_html( get_the_date() ); ?>
					</time>
					<?php if ( has_tag() ) : ?>
						<span><?php the_tags( '', ' &middot; ', '' ); ?></span>
					<?php endif; ?>
				</div>

			</header>

			<?php if ( has_post_thumbnail() ) : ?>
				<figure class="entry-thumbnail" style="margin-bottom: var(--space-12); border-radius: var(--radius-lg); overflow: hidden;">
					<?php the_post_thumbnail( 'large' ); ?>
				</figure>
			<?php endif; ?>

			<div class="entry-content">
				<?php
				the_content( sprintf(
					wp_kses( __( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'everyday-zing-theme' ), [ 'span' => [ 'class' => [] ] ] ),
					get_the_title()
				) );
				wp_link_pages( [ 'before' => '<div class="page-links">' . __( 'Pages:', 'everyday-zing-theme' ), 'after' => '</div>' ] );
				?>
			</div>

			<footer class="entry-footer" style="margin-top: var(--space-12); padding-top: var(--space-8); border-top: 1px solid var(--color-border);">
				<?php
				the_tags( '<div class="entry-tags">' . __( 'Tags: ', 'everyday-zing-theme' ), ', ', '</div>' );
				?>
			</footer>

		</article>

		<?php
		the_post_navigation( [
			'prev_text' => '<span class="nav-subtitle">' . __( 'Previous', 'everyday-zing-theme' ) . '</span><span class="nav-title">%title</span>',
			'next_text' => '<span class="nav-subtitle">' . __( 'Next', 'everyday-zing-theme' ) . '</span><span class="nav-title">%title</span>',
		] );
		?>

		<?php if ( comments_open() || get_comments_number() ) : ?>
			<?php comments_template(); ?>
		<?php endif; ?>

	<?php endwhile; ?>

</div>

<?php get_footer(); ?>
