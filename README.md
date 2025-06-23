# Pdfinho
Experimental testing of client-side PDF editing (combine, edit, sign, etc.).

This project is implemented with **React** and **Tailwind CSS**.

## Features tested so far

- Combining PDFs
- Deleting Pages 
- Editing with:
  - Text
  - Headings
  - Images
  - Checkboxes

## Getting Started

1. Install dependencies:
   ```
   npm ci
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. **Before running Docker Compose**:  
   Build the project:
   ```
   npm run build
   ```

   Then start Docker Compose:
   ```
   docker compose up