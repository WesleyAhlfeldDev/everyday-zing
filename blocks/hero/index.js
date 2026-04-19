import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit() {
		const blockProps = useBlockProps( { className: 'hero-block-editor-preview' } );
		return (
			<div { ...blockProps }>
				<p style={ { textAlign: 'center', padding: '2rem', background: '#f9f9f7', borderRadius: '8px' } }>
					<strong>Hero Block</strong> — configure fields in the sidebar.
				</p>
			</div>
		);
	},
	save() {
		// Server-side rendered via render.php
		return null;
	},
} );
