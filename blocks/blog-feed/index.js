import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit() {
		const blockProps = useBlockProps();
		return (
			<div { ...blockProps } style={ { padding: '2rem', background: '#F8F7F5', borderRadius: '8px', textAlign: 'center' } }>
				<strong>Blog Feed Block</strong>
				<p style={ { color: '#888', fontSize: '13px', marginTop: '8px' } }>Displays your latest posts with featured article, grid, and Zing tip.</p>
			</div>
		);
	},
	save: () => null,
} );
