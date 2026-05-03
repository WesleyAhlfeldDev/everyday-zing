import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, CheckboxControl, Button, RangeControl, __experimentalGrid as Grid } from '@wordpress/components';
import metadata from './block.json';

const NONE = { label: '— None —', value: '' };

const TAG_OPTS = [
	{ label: 'section', value: 'section' },
	{ label: 'div',     value: 'div' },
	{ label: 'article', value: 'article' },
	{ label: 'aside',   value: 'aside' },
	{ label: 'header',  value: 'header' },
	{ label: 'footer',  value: 'footer' },
	{ label: 'main',    value: 'main' },
];

const CONTAINER_OPTS = [
	{ label: '— No container —',  value: '' },
	{ label: 'Container',         value: 'container' },
	{ label: 'Container Fluid',   value: 'container-fluid' },
	{ label: 'Container SM',      value: 'container-sm' },
	{ label: 'Container MD',      value: 'container-md' },
	{ label: 'Container LG',      value: 'container-lg' },
	{ label: 'Container XL',      value: 'container-xl' },
	{ label: 'Container XXL',     value: 'container-xxl' },
];

const makePadding = ( prefix ) => [
	NONE,
	...[ 0, 1, 2, 3, 4, 5 ].map( ( n ) => ( { label: `${ prefix.toUpperCase() }-${ n }`, value: `${ prefix }-${ n }` } ) ),
];

const BG_OPTS = [
	NONE,
	{ label: 'White',                  value: 'bg-white' },
	{ label: 'Light (Soft White)',     value: 'bg-light' },
	{ label: 'Dark (Rich Black)',      value: 'bg-dark' },
	{ label: 'Primary — Joy Pink',     value: 'bg-primary' },
	{ label: 'Success — Money Teal',   value: 'bg-success' },
	{ label: 'Info — Bold Purple',     value: 'bg-info' },
	{ label: 'Warning — Zing Lime',    value: 'bg-warning' },
	{ label: 'Danger — Warm Coral',    value: 'bg-danger' },
	{ label: 'Zing Lime',              value: 'bg-zing-lime' },
	{ label: 'Joy Pink',               value: 'bg-joy-pink' },
	{ label: 'Bold Purple',            value: 'bg-bold-purple' },
	{ label: 'Warm Coral',             value: 'bg-warm-coral' },
	{ label: 'Money Teal',             value: 'bg-money-teal' },
	{ label: 'Warm Cream',             value: 'bg-warm-cream' },
	{ label: 'Burgundy Script',        value: 'bg-burgundy-script' },
];

const TEXT_OPTS = [
	{ label: '— Default —',   value: '' },
	{ label: 'White',         value: 'text-white' },
	{ label: 'Dark',          value: 'text-dark' },
	{ label: 'Muted',         value: 'text-muted' },
	{ label: 'Primary',       value: 'text-primary' },
];

const BG_SIZE_OPTS = [
	{ label: 'Cover',   value: 'cover' },
	{ label: 'Contain', value: 'contain' },
	{ label: 'Auto',    value: 'auto' },
];

const BG_POSITION_OPTS = [
	{ label: 'Center Center', value: 'center center' },
	{ label: 'Center Top',    value: 'center top' },
	{ label: 'Center Bottom', value: 'center bottom' },
	{ label: 'Left Center',   value: 'left center' },
	{ label: 'Left Top',      value: 'left top' },
	{ label: 'Left Bottom',   value: 'left bottom' },
	{ label: 'Right Center',  value: 'right center' },
	{ label: 'Right Top',     value: 'right top' },
	{ label: 'Right Bottom',  value: 'right bottom' },
];

const BG_REPEAT_OPTS = [
	{ label: 'No Repeat', value: 'no-repeat' },
	{ label: 'Repeat',    value: 'repeat' },
	{ label: 'Repeat X',  value: 'repeat-x' },
	{ label: 'Repeat Y',  value: 'repeat-y' },
];

const GRADIENT_PRESETS = [
	{ label: 'Black → Transparent (down)', value: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)' },
	{ label: 'Transparent → Black (down)', value: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)' },
	{ label: 'Black → Transparent (right)',value: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)' },
	{ label: 'Black → Transparent (left)', value: 'linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)' },
	{ label: 'Joy Pink → Transparent',     value: 'linear-gradient(to bottom, rgba(233,85,138,0.85) 0%, rgba(233,85,138,0) 100%)' },
	{ label: 'Bold Purple → Transparent',  value: 'linear-gradient(to bottom, rgba(166,104,194,0.85) 0%, rgba(166,104,194,0) 100%)' },
	{ label: 'Joy Pink → Bold Purple',     value: 'linear-gradient(135deg, rgba(233,85,138,0.9) 0%, rgba(166,104,194,0.9) 100%)' },
	{ label: 'Burgundy → Joy Pink',        value: 'linear-gradient(135deg, rgba(107,31,58,0.9) 0%, rgba(233,85,138,0.75) 100%)' },
	{ label: 'Money Teal → Bold Purple',   value: 'linear-gradient(135deg, rgba(93,202,165,0.9) 0%, rgba(166,104,194,0.9) 100%)' },
	{ label: 'Zing Lime → Money Teal',     value: 'linear-gradient(135deg, rgba(200,224,80,0.9) 0%, rgba(93,202,165,0.9) 100%)' },
];

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const {
			tag, container, paddingY, paddingX, marginY, background, textColor,
			useCustomSpacing,
			customPaddingTop, customPaddingRight, customPaddingBottom, customPaddingLeft,
			customMarginTop, customMarginBottom,
			backgroundImageUrl, backgroundImageId, backgroundSize, backgroundPosition, backgroundRepeat,
			overlayType, overlayColor, overlayGradient, overlayOpacity,
		} = attributes;

		const blockProps = useBlockProps( {
			style: {
				position: 'relative',
				border: '2px dashed #A668C2',
				padding: '16px',
				minHeight: '80px',
				background: 'rgba(166,104,194,0.04)',
			},
		} );

		return (
			<>
				<InspectorControls>
					<PanelBody title="Layout" initialOpen={ true }>
						<SelectControl
							label="HTML Tag"
							value={ tag }
							options={ TAG_OPTS }
							onChange={ ( v ) => setAttributes( { tag: v } ) }
						/>
						<SelectControl
							label="Container"
							value={ container }
							options={ CONTAINER_OPTS }
							onChange={ ( v ) => setAttributes( { container: v } ) }
						/>
					</PanelBody>
					<PanelBody title="Spacing" initialOpen={ false }>
						{ ! useCustomSpacing && (
							<>
								<SelectControl
									label="Padding Y (top & bottom)"
									value={ paddingY }
									options={ makePadding( 'py' ) }
									onChange={ ( v ) => setAttributes( { paddingY: v } ) }
								/>
								<SelectControl
									label="Padding X (left & right)"
									value={ paddingX }
									options={ makePadding( 'px' ) }
									onChange={ ( v ) => setAttributes( { paddingX: v } ) }
								/>
								<SelectControl
									label="Margin Y (top & bottom)"
									value={ marginY }
									options={ makePadding( 'my' ) }
									onChange={ ( v ) => setAttributes( { marginY: v } ) }
								/>
							</>
						) }
						<CheckboxControl
							label="Custom spacing?"
							checked={ useCustomSpacing }
							onChange={ ( v ) => setAttributes( { useCustomSpacing: v } ) }
						/>
						{ useCustomSpacing && (
							<>
								<p style={ { fontSize: '11px', color: '#757575', margin: '4px 0 12px' } }>
									Accepts any CSS value — px, rem, %, etc.
								</p>
								<Grid columns={ 2 }>
									<TextControl
										label="Padding Top"
										value={ customPaddingTop }
										placeholder="e.g. 80px"
										onChange={ ( v ) => setAttributes( { customPaddingTop: v } ) }
									/>
									<TextControl
										label="Padding Bottom"
										value={ customPaddingBottom }
										placeholder="e.g. 80px"
										onChange={ ( v ) => setAttributes( { customPaddingBottom: v } ) }
									/>
									<TextControl
										label="Padding Left"
										value={ customPaddingLeft }
										placeholder="e.g. 2rem"
										onChange={ ( v ) => setAttributes( { customPaddingLeft: v } ) }
									/>
									<TextControl
										label="Padding Right"
										value={ customPaddingRight }
										placeholder="e.g. 2rem"
										onChange={ ( v ) => setAttributes( { customPaddingRight: v } ) }
									/>
									<TextControl
										label="Margin Top"
										value={ customMarginTop }
										placeholder="e.g. 40px"
										onChange={ ( v ) => setAttributes( { customMarginTop: v } ) }
									/>
									<TextControl
										label="Margin Bottom"
										value={ customMarginBottom }
										placeholder="e.g. 40px"
										onChange={ ( v ) => setAttributes( { customMarginBottom: v } ) }
									/>
								</Grid>
							</>
						) }
					</PanelBody>
					<PanelBody title="Style" initialOpen={ false }>
						<SelectControl
							label="Background Color"
							value={ background }
							options={ BG_OPTS }
							onChange={ ( v ) => setAttributes( { background: v } ) }
						/>
						<SelectControl
							label="Text Color"
							value={ textColor }
							options={ TEXT_OPTS }
							onChange={ ( v ) => setAttributes( { textColor: v } ) }
						/>
					</PanelBody>
					<PanelBody title="Background Image" initialOpen={ false }>
						{ backgroundImageUrl && (
							<img
								src={ backgroundImageUrl }
								alt=""
								style={ { width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px', display: 'block' } }
							/>
						) }
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => setAttributes( { backgroundImageUrl: media.url, backgroundImageId: media.id } ) }
								allowedTypes={ [ 'image' ] }
								value={ backgroundImageId }
								render={ ( { open } ) => (
									<Button variant="secondary" onClick={ open } style={ { width: '100%', justifyContent: 'center', marginBottom: '8px' } }>
										{ backgroundImageId ? 'Replace Image' : 'Select Image' }
									</Button>
								) }
							/>
						</MediaUploadCheck>
						{ backgroundImageId > 0 && (
							<Button
								variant="link"
								isDestructive
								onClick={ () => setAttributes( { backgroundImageUrl: '', backgroundImageId: 0 } ) }
								style={ { marginBottom: '16px' } }
							>
								Remove Image
							</Button>
						) }
						{ backgroundImageId > 0 && (
							<>
								<SelectControl
									label="Size"
									value={ backgroundSize }
									options={ BG_SIZE_OPTS }
									onChange={ ( v ) => setAttributes( { backgroundSize: v } ) }
								/>
								<SelectControl
									label="Position"
									value={ backgroundPosition }
									options={ BG_POSITION_OPTS }
									onChange={ ( v ) => setAttributes( { backgroundPosition: v } ) }
								/>
								<SelectControl
									label="Repeat"
									value={ backgroundRepeat }
									options={ BG_REPEAT_OPTS }
									onChange={ ( v ) => setAttributes( { backgroundRepeat: v } ) }
								/>
								<hr style={ { margin: '12px 0' } } />
								<SelectControl
									label="Overlay"
									value={ overlayType }
									options={ [
										{ label: '— None —',      value: '' },
										{ label: 'Solid Color',   value: 'solid' },
										{ label: 'Gradient',      value: 'gradient' },
									] }
									onChange={ ( v ) => setAttributes( { overlayType: v } ) }
								/>
								{ overlayType === 'solid' && (
									<>
										<p style={ { fontSize: '11px', color: '#757575', margin: '4px 0 8px' } }>Color</p>
										<ColorPalette
											colors={ [
												{ name: 'Black',           color: '#000000' },
												{ name: 'White',           color: '#ffffff' },
												{ name: 'Joy Pink',        color: '#E9558A' },
												{ name: 'Bold Purple',     color: '#A668C2' },
												{ name: 'Zing Lime',       color: '#C8E050' },
												{ name: 'Warm Coral',      color: '#F0845C' },
												{ name: 'Money Teal',      color: '#5DCAA5' },
												{ name: 'Burgundy Script', color: '#6B1F3A' },
											] }
											value={ overlayColor }
											onChange={ ( v ) => setAttributes( { overlayColor: v ?? '' } ) }
										/>
										<RangeControl
											label="Opacity"
											value={ overlayOpacity }
											onChange={ ( v ) => setAttributes( { overlayOpacity: v } ) }
											min={ 0 }
											max={ 100 }
											step={ 5 }
										/>
									</>
								) }
								{ overlayType === 'gradient' && (
									<>
										<SelectControl
											label="Gradient Preset"
											value={ GRADIENT_PRESETS.some( ( p ) => p.value === overlayGradient ) ? overlayGradient : '__custom__' }
											options={ [
												{ label: '— Choose a preset —', value: '' },
												...GRADIENT_PRESETS,
												{ label: '— Custom —',          value: '__custom__' },
											] }
											onChange={ ( v ) => {
												if ( v !== '__custom__' ) {
													setAttributes( { overlayGradient: v } );
												} else {
													setAttributes( { overlayGradient: '' } );
												}
											} }
										/>
										<TextControl
											label="Custom Gradient CSS"
											value={ overlayGradient }
											placeholder="e.g. linear-gradient(135deg, #E9558A, #A668C2)"
											onChange={ ( v ) => setAttributes( { overlayGradient: v } ) }
											help="Paste any valid CSS gradient. Selecting a preset above pre-fills this field."
										/>
										<RangeControl
											label="Opacity"
											value={ overlayOpacity }
											onChange={ ( v ) => setAttributes( { overlayOpacity: v } ) }
											min={ 0 }
											max={ 100 }
											step={ 5 }
										/>
									</>
								) }
							</>
						) }
					</PanelBody>
				</InspectorControls>

				<div { ...blockProps }>
					<span style={ { display: 'block', marginBottom: '8px', fontSize: '9px', fontWeight: '700', letterSpacing: '.1em', textTransform: 'uppercase', color: '#A668C2' } }>
						Section { container ? `/ ${ container }` : '' }
					</span>
					<InnerBlocks renderAppender={ InnerBlocks.ButtonBlockAppender } />
				</div>
			</>
		);
	},

	save() {
		return <InnerBlocks.Content />;
	},
} );
