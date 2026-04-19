<?php
$greeting  = get_field( 'hero_greeting' )      ?: "hey hello, I'm";
$name      = get_field( 'hero_name' )           ?: 'Carol Joy';
$tagline   = get_field( 'hero_title_tagline' )  ?: 'finding the zing in everyday life';
$subtitle  = get_field( 'hero_subtitle' )       ?: 'Real recipes, honest money talk, and adventures you can actually afford. Welcome to my corner of the internet.';
$photo     = get_field( 'hero_photo' );
$cta_pri   = get_field( 'hero_cta_primary' );
$cta_ghost = get_field( 'hero_cta_ghost' );

$anchor = ! empty( $block['anchor'] ) ? ' id="' . esc_attr( $block['anchor'] ) . '"' : '';
?>

<section class="hero-block"<?php echo $anchor; ?>>

	<div class="hero-block__left">
		<div class="hero-block__accent hero-block__accent--pink"></div>
		<div class="hero-block__accent hero-block__accent--purple"></div>
		<div class="hero-block__accent hero-block__accent--lime"></div>
		<div class="hero-block__photo">
			<?php if ( $photo ) : ?>
				<img src="<?php echo esc_url( $photo['url'] ); ?>"
					alt="<?php echo esc_attr( $photo['alt'] ?: $name ); ?>"
					width="<?php echo esc_attr( $photo['width'] ); ?>"
					height="<?php echo esc_attr( $photo['height'] ); ?>">
			<?php else : ?>
				<div class="hero-block__avatar">
					<?php echo esc_html( mb_substr( $name, 0, 2 ) ); ?>
				</div>
			<?php endif; ?>
		</div>
	</div>

	<div class="hero-block__right">
		<p class="hero-block__greeting"><?php echo esc_html( $greeting ); ?></p>
		<h1 class="hero-block__title">
			<em><?php echo esc_html( $name ); ?></em>
			<?php if ( $tagline ) : ?> — <?php echo esc_html( $tagline ); ?><?php endif; ?>
		</h1>
		<?php if ( $subtitle ) : ?>
			<p class="hero-block__sub"><?php echo esc_html( $subtitle ); ?></p>
		<?php endif; ?>
		<div class="hero-block__actions">
			<?php if ( $cta_pri ) : ?>
				<a href="<?php echo esc_url( $cta_pri['url'] ); ?>"
					class="hero-block__btn hero-block__btn--primary"
					<?php echo $cta_pri['target'] ? 'target="' . esc_attr( $cta_pri['target'] ) . '"' : ''; ?>>
					<?php echo esc_html( $cta_pri['title'] ); ?>
				</a>
			<?php endif; ?>
			<?php if ( $cta_ghost ) : ?>
				<a href="<?php echo esc_url( $cta_ghost['url'] ); ?>"
					class="hero-block__btn hero-block__btn--ghost"
					<?php echo $cta_ghost['target'] ? 'target="' . esc_attr( $cta_ghost['target'] ) . '"' : ''; ?>>
					<?php echo esc_html( $cta_ghost['title'] ); ?>
				</a>
			<?php endif; ?>
		</div>
	</div>

</section>
