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

function zing_get_post_cat_style( $post_id, $styles, $default ) {
	$cats = get_the_category( $post_id );
	if ( ! $cats ) return [ 'style' => $default, 'name' => '' ];
	return [ 'style' => $styles[ $cats[0]->slug ] ?? $default, 'name' => $cats[0]->name ];
}
?>

<section class="blog-feed"<?php echo $anchor; ?>>
	<div class="blog-feed__inner">

		<p class="blog-feed__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
		<h2 class="blog-feed__title"><?php echo esc_html( $title ); ?></h2>

		<?php if ( $query->have_posts() ) :
			$post_count_i = 0;
			$grid_posts   = [];

			while ( $query->have_posts() ) :
				$query->the_post();
				$pid      = get_the_ID();
				$cat_data = zing_get_post_cat_style( $pid, $cat_styles, $default_style );
				$style    = $cat_data['style'];
				$cat_name = $cat_data['name'];

				if ( $post_count_i === 0 ) :
		?>
			<article class="blog-feed__featured">
				<a class="blog-feed__feat-thumb" href="<?php the_permalink(); ?>" style="background:<?php echo esc_attr( $style['img_bg'] ); ?>;">
					<?php if ( has_post_thumbnail() ) the_post_thumbnail( 'card-thumbnail' ); ?>
					<?php if ( $cat_name ) : ?>
						<span class="blog-feed__badge" style="background:<?php echo esc_attr( $style['bg'] ); ?>;color:<?php echo esc_attr( $style['color'] ); ?>;">
							<?php echo esc_html( $cat_name ); ?>
						</span>
					<?php endif; ?>
				</a>
				<div class="blog-feed__feat-body">
					<h3 class="blog-feed__feat-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
					<p class="blog-feed__feat-desc"><?php echo wp_trim_words( get_the_excerpt(), 20 ); ?></p>
					<div class="blog-feed__feat-meta">
						<div class="blog-feed__avatar"><?php echo esc_html( mb_substr( get_the_author(), 0, 2 ) ); ?></div>
						<span class="blog-feed__meta-txt">
							<?php the_author(); ?> &middot; <?php echo get_the_date(); ?> &middot; <?php echo esc_html( max( 1, ceil( str_word_count( get_the_content() ) / 200 ) ) ); ?> min read
						</span>
						<a href="<?php the_permalink(); ?>" class="blog-feed__read-more">Read more &rarr;</a>
					</div>
				</div>
			</article>
		<?php
				else :
					$grid_posts[] = [ 'pid' => $pid, 'title' => get_the_title(), 'link' => get_the_permalink(), 'cat' => $cat_name, 'style' => $style ];
				endif;
				$post_count_i++;
			endwhile;
			wp_reset_postdata();
		?>

			<?php if ( $grid_posts ) : ?>
				<div class="blog-feed__grid">
					<?php foreach ( $grid_posts as $gp ) : ?>
						<article class="blog-feed__card">
							<a class="blog-feed__card-thumb" href="<?php echo esc_url( $gp['link'] ); ?>" style="background:<?php echo esc_attr( $gp['style']['img_bg'] ); ?>;"></a>
							<div class="blog-feed__card-body">
								<?php if ( $gp['cat'] ) : ?>
									<span class="blog-feed__badge" style="background:<?php echo esc_attr( $gp['style']['bg'] ); ?>;color:<?php echo esc_attr( $gp['style']['color'] ); ?>;">
										<?php echo esc_html( $gp['cat'] ); ?>
									</span>
								<?php endif; ?>
								<h3 class="blog-feed__card-title"><a href="<?php echo esc_url( $gp['link'] ); ?>"><?php echo esc_html( $gp['title'] ); ?></a></h3>
							</div>
						</article>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

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
