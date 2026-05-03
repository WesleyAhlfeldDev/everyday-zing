<?php
$eyebrow       = get_field( 'feed_eyebrow' )        ?: 'This week';
$title         = get_field( 'feed_title' )           ?: 'Fresh from the blog';
$post_count    = (int) ( get_field( 'feed_post_count' ) ?: 5 );
$zing_tip      = get_field( 'zing_tip_text' )        ?: 'Pack snacks. Always. Your wallet (and your mood) will thank you mid-flight.';
$show_zing_tip = get_field( 'feed_show_zing_tip' );
$show_zing_tip = $show_zing_tip === null ? true : (bool) $show_zing_tip;

$anchor = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';

$query = new WP_Query( [
	'posts_per_page' => $post_count,
	'post_status'    => 'publish',
	'orderby'        => 'date',
	'order'          => 'DESC',
] );

$cat_styles = [
	'food'    => [ 'bg' => '#FCE4ED', 'color' => '#99224E', 'img_bg' => '#FCE4ED' ],
	'finance' => [ 'bg' => '#D9F3ED', 'color' => '#0A5C46', 'img_bg' => '#D9F3ED' ],
	'travel'  => [ 'bg' => '#FAEAE4', 'color' => '#993C1D', 'img_bg' => '#FAEAE4' ],
];
$default_style = [ 'bg' => '#EAF5BF', 'color' => '#4E6A10', 'img_bg' => '#EAF5BF' ];

if ( ! function_exists( 'zing_get_post_cat_style' ) ) :
function zing_get_post_cat_style( $post_id, $styles, $default ) {
	$cats = get_the_category( $post_id );
	if ( ! $cats ) return [ 'style' => $default, 'name' => '' ];
	return [ 'style' => $styles[ $cats[0]->slug ] ?? $default, 'name' => $cats[0]->name ];
}
endif;
?>

<section class="blog-feed"<?php echo $anchor; ?>>
	<div class="blog-feed__inner">

		<p class="blog-feed__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
		<h2 class="blog-feed__title"><?php echo esc_html( $title ); ?></h2>

		<?php if ( $query->have_posts() ) :
			$post_index = 0;
			$grid_posts = [];

			while ( $query->have_posts() ) :
				$query->the_post();
				$pid      = get_the_ID();
				$cat_data = zing_get_post_cat_style( $pid, $cat_styles, $default_style );
				$style    = $cat_data['style'];
				$cat_name = $cat_data['name'];

				if ( $post_index === 0 ) :
					$featured = [
						'pid'      => $pid,
						'title'    => get_the_title(),
						'link'     => get_the_permalink(),
						'excerpt'  => wp_trim_words( get_the_excerpt(), 20 ),
						'author'   => get_the_author(),
						'date'     => get_the_date(),
						'read'     => max( 1, ceil( str_word_count( get_the_content() ) / 200 ) ),
						'cat'      => $cat_name,
						'style'    => $style,
						'thumb'    => get_the_post_thumbnail_url( $pid, 'large' ),
					];
				else :
					$grid_posts[] = [
						'pid'   => $pid,
						'title' => get_the_title(),
						'link'  => get_the_permalink(),
						'cat'   => $cat_name,
						'style' => $style,
						'thumb' => get_the_post_thumbnail_url( $pid, 'card-thumbnail' ),
					];
				endif;
				$post_index++;
			endwhile;
			wp_reset_postdata();
		?>

		<div class="blog-feed__layout">

			<?php if ( ! empty( $featured ) ) :
				$f = $featured; ?>
			<article class="blog-feed__featured">
				<a class="blog-feed__feat-thumb" href="<?php echo esc_url( $f['link'] ); ?>" style="background:<?php echo esc_attr( $f['style']['img_bg'] ); ?>;">
					<?php if ( $f['thumb'] ) : ?>
						<img src="<?php echo esc_url( $f['thumb'] ); ?>" alt="<?php echo esc_attr( $f['title'] ); ?>" loading="lazy">
					<?php endif; ?>
					<?php if ( $f['cat'] ) : ?>
						<span class="blog-feed__badge" style="background:<?php echo esc_attr( $f['style']['bg'] ); ?>;color:<?php echo esc_attr( $f['style']['color'] ); ?>;">
							<?php echo esc_html( $f['cat'] ); ?>
						</span>
					<?php endif; ?>
				</a>
				<div class="blog-feed__feat-body">
					<h3 class="blog-feed__feat-title"><a href="<?php echo esc_url( $f['link'] ); ?>"><?php echo esc_html( $f['title'] ); ?></a></h3>
					<p class="blog-feed__feat-desc"><?php echo esc_html( $f['excerpt'] ); ?></p>
					<div class="blog-feed__feat-meta">
						<div class="blog-feed__avatar"><?php echo esc_html( mb_substr( $f['author'], 0, 2 ) ); ?></div>
						<span class="blog-feed__meta-txt">
							<?php echo esc_html( $f['author'] ); ?> &middot; <?php echo esc_html( $f['date'] ); ?> &middot; <?php echo esc_html( $f['read'] ); ?> min read
						</span>
						<a href="<?php echo esc_url( $f['link'] ); ?>" class="blog-feed__read-more">Read more &rarr;</a>
					</div>
				</div>
			</article>
			<?php endif; ?>

			<?php if ( $grid_posts ) : ?>
			<div class="blog-feed__grid">
				<?php foreach ( $grid_posts as $gp ) : ?>
				<article class="blog-feed__card">
					<a class="blog-feed__card-thumb" href="<?php echo esc_url( $gp['link'] ); ?>" style="background:<?php echo esc_attr( $gp['style']['img_bg'] ); ?>;">
						<?php if ( $gp['thumb'] ) : ?>
							<img src="<?php echo esc_url( $gp['thumb'] ); ?>" alt="<?php echo esc_attr( $gp['title'] ); ?>" loading="lazy">
						<?php endif; ?>
						<?php if ( $gp['cat'] ) : ?>
							<span class="blog-feed__badge" style="background:<?php echo esc_attr( $gp['style']['bg'] ); ?>;color:<?php echo esc_attr( $gp['style']['color'] ); ?>;">
								<?php echo esc_html( $gp['cat'] ); ?>
							</span>
						<?php endif; ?>
					</a>
					<div class="blog-feed__card-body">
						<h3 class="blog-feed__card-title"><a href="<?php echo esc_url( $gp['link'] ); ?>"><?php echo esc_html( $gp['title'] ); ?></a></h3>
					</div>
				</article>
				<?php endforeach; ?>
			</div>
			<?php endif; ?>

		</div>

		<?php else : ?>
			<p class="blog-feed__empty"><?php esc_html_e( 'No posts found.', 'everyday-zing-theme' ); ?></p>
		<?php endif; ?>

		<?php if ( $show_zing_tip && $zing_tip ) : ?>
			<div class="blog-feed__zing-tip">
				<p class="blog-feed__zing-label"><?php esc_html_e( 'Zing tip of the week', 'everyday-zing-theme' ); ?></p>
				<p class="blog-feed__zing-text"><?php echo esc_html( $zing_tip ); ?></p>
			</div>
		<?php endif; ?>

	</div>
</section>
