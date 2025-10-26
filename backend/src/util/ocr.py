import os
import pytesseract
from pdf2image import convert_from_path
from typing import List, Optional


def extract_text_from_pdf(pdf_path: str, dpi: int = 600) -> str:
    """
    Extract text from a PDF file using OCR.
    
    Args:
        pdf_path: Path to the PDF file
        dpi: Resolution for PDF to image conversion (default: 600)
        
    Returns:
        Extracted text as a string
    """
    try:
        # Convert PDF to images
        pages = convert_from_path(pdf_path, dpi)
        
        # Extract text from each page
        text_data = ''
        for i, page in enumerate(pages):
            text = pytesseract.image_to_string(page)
            text_data += text + '\n'
            
        return text_data
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        return ""


def extract_text_from_pdf_bytes(pdf_bytes: bytes, dpi: int = 600) -> str:
    """
    Extract text from PDF bytes using OCR.
    
    Args:
        pdf_bytes: PDF content as bytes
        dpi: Resolution for PDF to image conversion (default: 600)
        
    Returns:
        Extracted text as a string
    """
    try:
        # Create a temporary file
        temp_path = "temp_pdf_file.pdf"
        with open(temp_path, "wb") as f:
            f.write(pdf_bytes)
        
        # Extract text
        text = extract_text_from_pdf(temp_path, dpi)
        
        # Clean up
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return text
    except Exception as e:
        print(f"Error extracting text from PDF bytes: {str(e)}")
        return ""


def process_multiple_pdfs(pdf_paths: List[str], dpi: int = 600) -> dict:
    """
    Process multiple PDF files and extract text from each.
    
    Args:
        pdf_paths: List of paths to PDF files
        dpi: Resolution for PDF to image conversion (default: 600)
        
    Returns:
        Dictionary with file paths as keys and extracted text as values
    """
    results = {}
    for path in pdf_paths:
        if os.path.exists(path) and path.lower().endswith('.pdf'):
            text = extract_text_from_pdf(path, dpi)
            results[path] = text
    
    return results