<?php
$handle     = get_field( 'ig_handle' )     ?: 'caroljoyzing';
$handle_url = get_field( 'ig_handle_url' ) ?: 'https://instagram.com/caroljoyzing';
$posts      = get_field( 'ig_posts' );

$anchor = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';

// Fallback placeholder posts shown until ACF posts are configured
$placeholder_posts = [
	[ 'bg' => '#FCE4ED', 'emoji' => '🍝', 'caption' => 'Sunday night fridge pasta' ],
	[ 'bg' => '#D9F3ED', 'emoji' => '📈', 'caption' => 'Portfolio update — year one' ],
	[ 'bg' => '#EAF5BF', 'emoji' => '✈️', 'caption' => 'Airport snacks that make sense' ],
	[ 'bg' => '#FAEAE4', 'emoji' => '🌮', 'caption' => 'Tuesday tacos, every week' ],
	[ 'bg' => '#D9F3ED', 'emoji' => '💰', 'caption' => 'The spreadsheet that changed things' ],
	[ 'bg' => '#FAEAE4', 'emoji' => '🧳', 'caption' => 'One carry-on. Two weeks.' ],
	[ 'bg' => '#FCE4ED', 'emoji' => '🥗', 'caption' => 'Meal prep in 90 minutes' ],
	[ 'bg' => '#EAF5BF', 'emoji' => '🎂', 'caption' => 'Birthday cake for $12' ],
];
?>

<section class="ig-block"<?php echo $anchor; ?>>

	<div class="ig-block__header">
		<h2 class="ig-block__heading"><?php esc_html_e( 'Follow along', 'everyday-zing-theme' ); ?></h2>
		<a class="ig-block__handle" href="<?php echo esc_url( $handle_url ); ?>" target="_blank" rel="noopener noreferrer">
			<span class="ig-block__ig-logo"></span>
			@<?php echo esc_html( ltrim( $handle, '@' ) ); ?>
		</a>
	</div>

	<div class="ig-block__track" id="ig-track">
		<?php if ( $posts ) : ?>
			<?php foreach ( $posts as $i => $post ) : ?>
				<?php $img = $post['ig_post_image']; ?>
				<div class="ig-block__card">
					<?php if ( $img ) : ?>
						<img class="ig-block__img"
							src="<?php echo esc_url( $img['sizes']['thumbnail'] ?? $img['url'] ); ?>"
							alt="<?php echo esc_attr( $img['alt'] ?: $post['ig_post_caption'] ); ?>"
							width="128" height="128">
					<?php endif; ?>
					<?php if ( $post['ig_post_caption'] ) : ?>
						<div class="ig-block__overlay">
							<p class="ig-block__caption"><?php echo esc_html( $post['ig_post_caption'] ); ?></p>
						</div>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		<?php else : ?>
			<?php foreach ( $placeholder_posts as $post ) : ?>
				<div class="ig-block__card">
					<div class="ig-block__img" style="background:<?php echo esc_attr( $post['bg'] ); ?>;">
						<?php echo $post['emoji']; ?>
					</div>
					<div class="ig-block__overlay">
						<p class="ig-block__caption"><?php echo esc_html( $post['caption'] ); ?></p>
					</div>
				</div>
			<?php endforeach; ?>
		<?php endif; ?>
	</div>

	<div class="ig-block__dots" id="ig-dots">
		<?php
		$count = $posts ? count( $posts ) : count( $placeholder_posts );
		for ( $i = 0; $i < $count; $i++ ) :
		?>
			<button class="ig-block__dot <?php echo $i === 0 ? 'is-active' : ''; ?>"
				aria-label="<?php printf( esc_attr__( 'Go to slide %d', 'everyday-zing-theme' ), $i + 1 ); ?>">
			</button>
		<?php endfor; ?>
	</div>

</section>
