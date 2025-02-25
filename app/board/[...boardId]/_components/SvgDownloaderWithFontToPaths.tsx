// components/SvgDownloaderWithFontToPaths.tsx
"use client";
import React, { useState } from 'react';

interface SvgDownloaderProps {
  svgId: string;
  fileName?: string;
  buttonText?: string;
}

const SvgDownloaderWithFontToPaths: React.FC<SvgDownloaderProps> = ({
  svgId,
  fileName = 'image.svg',
  buttonText = 'Download SVG',
}) => {
  const [isConverting, setIsConverting] = useState(false);

  const downloadSvg = async () => {
    try {
      setIsConverting(true);
      
      // Get the SVG element
      const svgElement = document.getElementById(svgId);
      
      if (!svgElement) {
        console.error(`SVG element with ID "${svgId}" not found`);
        return;
      }
      
      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      
      // Make sure the SVG has the proper xmlns attribute
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      
      // Option 1: If using external font conversion library
      // This is a placeholder for where you'd use a library like opentype.js
      // to convert text to paths. We'll simulate it with a comment.
      
      /*
      // Example with opentype.js (you would need to install and import this library)
      import opentype from 'opentype.js';
      
      const textElements = clonedSvg.querySelectorAll('text');
      
      for (const textEl of textElements) {
        const fontFamily = window.getComputedStyle(textEl).fontFamily.replace(/["']/g, '');
        const fontSize = parseFloat(window.getComputedStyle(textEl).fontSize);
        const text = textEl.textContent || '';
        const x = parseFloat(textEl.getAttribute('x') || '0');
        const y = parseFloat(textEl.getAttribute('y') || '0');
        
        // Load the font (you would need the font file)
        const font = await opentype.load(`/fonts/${fontFamily}.ttf`);
        
        // Create path from text
        const path = font.getPath(text, x, y, fontSize);
        
        // Create SVG path element
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('d', path.toPathData());
        pathEl.setAttribute('fill', window.getComputedStyle(textEl).fill);
        
        // Replace text element with path
        textEl.parentNode?.replaceChild(pathEl, textEl);
      }
      */
      
      // Option 2: As a simpler alternative, we'll make sure all font information
      // is explicitly included in the SVG
      const textElements = clonedSvg.querySelectorAll('text');
      const styles = document.createElement('style');
      
      // Get all font information from the document
      const computedFonts = new Set();
      textElements.forEach(textEl => {
        const style = window.getComputedStyle(textEl);
        const fontInfo = `
          font-family: ${style.fontFamily};
          font-size: ${style.fontSize};
          font-weight: ${style.fontWeight};
          font-style: ${style.fontStyle};
        `;
        computedFonts.add(fontInfo);
        
        // Set explicit font attributes
        textEl.setAttribute('font-family', style.fontFamily.replace(/["']/g, ''));
        textEl.setAttribute('font-size', style.fontSize);
        textEl.setAttribute('font-weight', style.fontWeight);
      });
      
      // Create font styles element
      const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      styleEl.textContent = Array.from(computedFonts).map((fontInfo, i) => {
        return `.font-${i} { ${fontInfo} }`;
      }).join('\n');
      
      // Add class to each text element
      textElements.forEach((textEl, i) => {
        textEl.setAttribute('class', `font-${i}`);
      });
      
      // Add style element to SVG
      clonedSvg.insertBefore(styleEl, clonedSvg.firstChild);
      
      // Get the SVG content
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      
      // Add XML declaration
      const svgDoctype = '<?xml version="1.0" standalone="no"?>\n';
      const finalSvgData = svgDoctype + svgData;
      
      // Create a Blob with the SVG data
      const svgBlob = new Blob([finalSvgData], { type: 'image/svg+xml;charset=utf-8' });
      
      // Create a URL for the Blob
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Create a temporary link element for downloading
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = fileName;
      
      // Append the link to the body, click it, and remove it
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Release the URL object
      URL.revokeObjectURL(svgUrl);
    } catch (error) {
      console.error('Error downloading SVG:', error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <button 
      onClick={downloadSvg}
      disabled={isConverting}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
    >
      {isConverting ? 'Converting...' : buttonText}
    </button>
  );
};

export default SvgDownloaderWithFontToPaths;