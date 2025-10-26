import os
import tempfile
import pytesseract
from pdf2image import convert_from_path
from typing import List, Optional

def extract_text_from_pdf(pdf_path: str, dpi: int = 300) -> str:
    """
    Extract text from a PDF file using OCR.
    
    Args:
        pdf_path: Path to the PDF file
        dpi: Resolution for PDF to image conversion (default: 300)
        
    Returns:
        Extracted text as a string
    """
    try:
        print(f"Processing PDF: {pdf_path}")
        
        # Convert PDF to images with a lower DPI for faster processing
        pages = convert_from_path(pdf_path, dpi)
        print(f"Converted PDF to {len(pages)} images")
        
        # Extract text from each page
        text_data = ''
        for i, page in enumerate(pages):
            print(f"Processing page {i+1}/{len(pages)}")
            text = pytesseract.image_to_string(page)
            text_data += f"--- Page {i+1} ---\n{text}\n\n"
            
        return text_data
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        return f"Error processing PDF: {str(e)}"

def extract_text_from_pdf_bytes(pdf_bytes: bytes, dpi: int = 300) -> str:
    """
    Extract text from PDF bytes using OCR.
    
    Args:
        pdf_bytes: PDF content as bytes
        dpi: Resolution for PDF to image conversion (default: 300)
        
    Returns:
        Extracted text as a string
    """
    try:
        # Create a temporary file with a proper name
        fd, temp_path = tempfile.mkstemp(suffix='.pdf')
        os.close(fd)
        
        # Write the bytes to the temporary file
        with open(temp_path, "wb") as f:
            f.write(pdf_bytes)
        
        print(f"Created temporary file at {temp_path}")
        
        # Extract text
        text = extract_text_from_pdf(temp_path, dpi)
        
        # Clean up
        os.remove(temp_path)
        print(f"Removed temporary file {temp_path}")
            
        return text
    except Exception as e:
        print(f"Error extracting text from PDF bytes: {str(e)}")
        return f"Error processing PDF bytes: {str(e)}"