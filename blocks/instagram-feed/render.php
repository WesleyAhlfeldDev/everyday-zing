<?php
/**
 * Instagram feed carousel block.
 * TODO ACF fields: ig_handle, ig_handle_url, ig_posts (repeater: image, caption)
 *
 * Note: Will connect to Instagram API or a plugin (e.g. Smash Balloon) in a future phase.
 * Placeholder cards shown until then.
 */

$anchor = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';

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
		<a class="ig-block__handle" href="https://instagram.com/caroljoyzing" target="_blank" rel="noopener noreferrer">
			<span class="ig-block__ig-logo"></span>
			@caroljoyzing
		</a>
	</div>

	<div class="ig-block__track" id="ig-track">
		<?php foreach ( $placeholder_posts as $i => $post ) : ?>
			<div class="ig-block__card">
				<div class="ig-block__img" style="background: <?php echo esc_attr( $post['bg'] ); ?>;">
					<?php echo $post['emoji']; ?>
				</div>
				<div class="ig-block__overlay">
					<p class="ig-block__caption"><?php echo esc_html( $post['caption'] ); ?></p>
				</div>
			</div>
		<?php endforeach; ?>
	</div>

	<div class="ig-block__dots" id="ig-dots">
		<?php foreach ( $placeholder_posts as $i => $_ ) : ?>
			<button class="ig-block__dot <?php echo $i === 0 ? 'is-active' : ''; ?>" aria-label="<?php printf( esc_attr__( 'Go to slide %d', 'everyday-zing-theme' ), $i + 1 ); ?>"></button>
		<?php endforeach; ?>
	</div>

</section>
