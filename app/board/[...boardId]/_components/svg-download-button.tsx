// components/SvgDownloader.tsx
"use client";
import { Hint } from '@/components/hint';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import React, { useRef } from 'react';

interface SvgDownloaderProps {
  svgId: string; // ID of the SVG element to download
  fileName?: string; // Optional custom filename
  buttonText?: string; // Optional custom button text
  embedFonts?: boolean; // Whether to embed fonts
}

const SvgDownloader: React.FC<SvgDownloaderProps> = ({
  svgId,
  fileName = 'image.svg',
  buttonText = 'Download SVG',
  embedFonts = true,
}) => {
  const downloadSvg = () => {
    // Get the SVG element
    const svgElement = document.getElementById(svgId);
    
    if (!svgElement) {
      console.error(`SVG element with ID "${svgId}" not found`);
      return;
    }
    
    // Clone the SVG to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    
    if (embedFonts) {
      // Get computed styles for the original SVG
      const svgStyle = window.getComputedStyle(svgElement);
      
      // Add font styles inline to the SVG
      const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
      style.textContent = `
        @font-face {
          font-family: "${svgStyle.fontFamily}";
          font-weight: ${svgStyle.fontWeight};
          font-style: ${svgStyle.fontStyle};
          src: local("${svgStyle.fontFamily}");
        }
        
        text {
          font-family: "${svgStyle.fontFamily}";
          font-size: ${svgStyle.fontSize};
          font-weight: ${svgStyle.fontWeight};
          font-style: ${svgStyle.fontStyle};
        }
      `;
      
      clonedSvg.insertBefore(style, clonedSvg.firstChild);
      
      // Set explicit text attributes on all text elements
      const textElements = clonedSvg.querySelectorAll('text');
      textElements.forEach(textEl => {
        if (!textEl.getAttribute('font-family')) {
          textEl.setAttribute('font-family', svgStyle.fontFamily.replace(/["']/g, ''));
        }
        if (!textEl.getAttribute('font-size')) {
          textEl.setAttribute('font-size', svgStyle.fontSize);
        }
        if (!textEl.getAttribute('font-weight')) {
          textEl.setAttribute('font-weight', svgStyle.fontWeight);
        }
      });
    }
    
    // Add XML namespace
    if (!clonedSvg.getAttribute('xmlns')) {
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    
    // Convert to viewBox if width/height is used without viewBox
    if (!clonedSvg.getAttribute('viewBox') && clonedSvg.getAttribute('width') && clonedSvg.getAttribute('height')) {
      const width = clonedSvg.getAttribute('width')?.replace('px', '') || '0';
      const height = clonedSvg.getAttribute('height')?.replace('px', '') || '0';
      clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }
    
    // Get the SVG content with the embedded styles
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
  };

  return (
    <Hint lable={buttonText} side="right" sideOffset={14}>
    <Button
      onClick={downloadSvg}
      size={"icon"}
    >
      <Download />
    </Button>
  </Hint>
  );
};

export default SvgDownloader;
