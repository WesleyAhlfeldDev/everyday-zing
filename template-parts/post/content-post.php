<?php $categories = get_the_category(); ?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'post-card h-100' ); ?>>

	<?php if ( has_post_thumbnail() ) : ?>
		<div class="post-card__thumb">
			<a href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
				<?php the_post_thumbnail( 'card-thumbnail' ); ?>
			</a>
		</div>
	<?php endif; ?>

	<div class="post-card__body">
		<?php if ( $categories ) : ?>
			<a class="post-card__category" href="<?php echo esc_url( get_category_link( $categories[0]->term_id ) ); ?>">
				<?php echo esc_html( $categories[0]->name ); ?>
			</a>
		<?php endif; ?>
		<h2 class="post-card__title">
			<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
		</h2>
		<p class="post-card__excerpt"><?php the_excerpt(); ?></p>
	</div>

	<div class="post-card__footer">
		<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
		<span><?php the_author(); ?></span>
	</div>

</article>
