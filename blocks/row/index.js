import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, __experimentalGrid as Grid } from '@wordpress/components';
import metadata from './block.json';

const DEFAULT = { label: '— Default —', value: '' };
const NONE    = { label: '— None —',    value: '' };

const JUSTIFY_OPTS = [
	DEFAULT,
	{ label: 'Start',         value: 'justify-content-start' },
	{ label: 'Center',        value: 'justify-content-center' },
	{ label: 'End',           value: 'justify-content-end' },
	{ label: 'Space Between', value: 'justify-content-between' },
	{ label: 'Space Around',  value: 'justify-content-around' },
	{ label: 'Space Evenly',  value: 'justify-content-evenly' },
];

const ALIGN_OPTS = [
	DEFAULT,
	{ label: 'Start',    value: 'align-items-start' },
	{ label: 'Center',   value: 'align-items-center' },
	{ label: 'End',      value: 'align-items-end' },
	{ label: 'Stretch',  value: 'align-items-stretch' },
	{ label: 'Baseline', value: 'align-items-baseline' },
];

const makeGutter = ( prefix ) => [
	DEFAULT,
	...[ 0, 1, 2, 3, 4, 5 ].map( ( n ) => ( { label: `${ prefix.toUpperCase() }-${ n }`, value: `${ prefix }-${ n }` } ) ),
];

const makeRowCols = ( bp ) => {
	const prefix = bp ? `row-cols-${ bp }` : 'row-cols';
	return [
		NONE,
		...[ 1, 2, 3, 4, 5, 6 ].map( ( n ) => ( { label: `${ n } per row`, value: `${ prefix }-${ n }` } ) ),
	];
};

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const {
			justify, alignItems, gutter, gutterX, gutterY,
			rowCols, rowColsSm, rowColsMd, rowColsLg,
			customPaddingTop, customPaddingRight, customPaddingBottom, customPaddingLeft,
			customMarginTop, customMarginBottom,
		} = attributes;

		const blockProps = useBlockProps( {
			style: {
				border: '2px dashed #E9558A',
				padding: '16px',
				minHeight: '60px',
				background: 'rgba(233,85,138,0.04)',
			},
		} );

		return (
			<>
				<InspectorControls>
					<PanelBody title="Alignment" initialOpen={ true }>
						<SelectControl
							label="Justify Content"
							value={ justify }
							options={ JUSTIFY_OPTS }
							onChange={ ( v ) => setAttributes( { justify: v } ) }
						/>
						<SelectControl
							label="Align Items"
							value={ alignItems }
							options={ ALIGN_OPTS }
							onChange={ ( v ) => setAttributes( { alignItems: v } ) }
						/>
					</PanelBody>
					<PanelBody title="Gutters" initialOpen={ false }>
						<SelectControl
							label="Gutter (both axes)"
							value={ gutter }
							options={ makeGutter( 'g' ) }
							onChange={ ( v ) => setAttributes( { gutter: v } ) }
						/>
						<SelectControl
							label="Gutter X (horizontal)"
							value={ gutterX }
							options={ makeGutter( 'gx' ) }
							onChange={ ( v ) => setAttributes( { gutterX: v } ) }
						/>
						<SelectControl
							label="Gutter Y (vertical)"
							value={ gutterY }
							options={ makeGutter( 'gy' ) }
							onChange={ ( v ) => setAttributes( { gutterY: v } ) }
						/>
					</PanelBody>
					<PanelBody title="Row Columns" initialOpen={ false }>
						<SelectControl label="All screens"  value={ rowCols }   options={ makeRowCols( '' ) }   onChange={ ( v ) => setAttributes( { rowCols: v } ) } />
						<SelectControl label="≥ SM (576px)" value={ rowColsSm } options={ makeRowCols( 'sm' ) } onChange={ ( v ) => setAttributes( { rowColsSm: v } ) } />
						<SelectControl label="≥ MD (768px)" value={ rowColsMd } options={ makeRowCols( 'md' ) } onChange={ ( v ) => setAttributes( { rowColsMd: v } ) } />
						<SelectControl label="≥ LG (992px)" value={ rowColsLg } options={ makeRowCols( 'lg' ) } onChange={ ( v ) => setAttributes( { rowColsLg: v } ) } />
					</PanelBody>
					<PanelBody title="Custom Spacing" initialOpen={ false }>
						<p style={ { fontSize: '11px', color: '#757575', marginBottom: '12px' } }>
							Accepts any CSS value — px, rem, %, etc. Applied as inline styles.
						</p>
						<Grid columns={ 2 }>
							<TextControl
								label="Padding Top"
								value={ customPaddingTop }
								placeholder="e.g. 40px"
								onChange={ ( v ) => setAttributes( { customPaddingTop: v } ) }
							/>
							<TextControl
								label="Padding Bottom"
								value={ customPaddingBottom }
								placeholder="e.g. 40px"
								onChange={ ( v ) => setAttributes( { customPaddingBottom: v } ) }
							/>
							<TextControl
								label="Padding Left"
								value={ customPaddingLeft }
								placeholder="e.g. 1rem"
								onChange={ ( v ) => setAttributes( { customPaddingLeft: v } ) }
							/>
							<TextControl
								label="Padding Right"
								value={ customPaddingRight }
								placeholder="e.g. 1rem"
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
					</PanelBody>
				</InspectorControls>

				<div { ...blockProps }>
					<span style={ { display: 'block', marginBottom: '8px', fontSize: '9px', fontWeight: '700', letterSpacing: '.1em', textTransform: 'uppercase', color: '#E9558A' } }>
						Row
					</span>
					<InnerBlocks
						allowedBlocks={ [ 'ahlfeld-solutions/column' ] }
						orientation="horizontal"
						renderAppender={ InnerBlocks.ButtonBlockAppender }
					/>
				</div>
			</>
		);
	},

	save() {
		return <InnerBlocks.Content />;
	},
} );
