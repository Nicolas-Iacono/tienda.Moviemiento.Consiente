import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      buyerEmail,
      ownerEmail,
      productName,
      quantity,
      totalPrice,
      address,
      purchaseDate,
      // Add any other relevant purchase data
    } = req.body;

    // Configure nodemailer with your email service
    const transporter = nodemailer.createTransport({
      // Configure your email service here
      // Example for Gmail:
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email to buyer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: buyerEmail,
      subject: '¡Gracias por tu compra en MegaOfertas!',
      html: `
        <h2>Confirmación de Compra</h2>
        <p>¡Gracias por tu compra! Aquí están los detalles:</p>
        <ul>
          <li><strong>Producto:</strong> ${productName}</li>
          <li><strong>Cantidad:</strong> ${quantity}</li>
          <li><strong>Precio Total:</strong> $${totalPrice}</li>
          <li><strong>Dirección de envío:</strong> ${address}</li>
          <li><strong>Fecha de compra:</strong> ${purchaseDate}</li>
        </ul>
        <p>Gracias por confiar en MegaOfertas!</p>
      `,
    });

    // Email to store owner
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: ownerEmail,
      subject: '¡Nueva venta en MegaOfertas!',
      html: `
        <h2>Nueva Venta Realizada</h2>
        <p>Se ha realizado una nueva venta en tu tienda:</p>
        <ul>
          <li><strong>Producto:</strong> ${productName}</li>
          <li><strong>Cantidad:</strong> ${quantity}</li>
          <li><strong>Precio Total:</strong> $${totalPrice}</li>
          <li><strong>Dirección de envío:</strong> ${address}</li>
          <li><strong>Fecha de compra:</strong> ${purchaseDate}</li>
          <li><strong>Email del comprador:</strong> ${buyerEmail}</li>
        </ul>
      `,
    });

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ message: 'Error sending emails', error: error.message });
  }
}
