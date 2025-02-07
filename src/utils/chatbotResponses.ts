interface ChatbotResponse {
    keywords: string[];
    response: string;
}

export const chatbotResponses: ChatbotResponse[] = [
    {
        keywords: ['register', 'signup', 'join', 'registration'],
        response: 'To register with SHA, click the "Register Now" button. You\'ll need your ID/Passport number, personal details, and contact information.'
    },
    {
        keywords: ['benefits', 'coverage', 'services', 'covered'],
        response: 'SHA offers comprehensive healthcare coverage including: \n- Outpatient services\n- Inpatient services\n- Maternity care\n- Emergency services\n- Chronic disease management'
    },
    {
        keywords: ['hospital', 'clinic', 'facility', 'provider'],
        response: 'You can find our network of healthcare providers by using the facility locator tool. We have over 8,000 accredited facilities nationwide.'
    },
    {
        keywords: ['payment', 'premium', 'contribute', 'fee'],
        response: 'Premium payments can be made through:\n- M-Pesa\n- Bank transfer\n- Direct debit\n- Employer deduction'
    },
    {
        keywords: ['contact', 'help', 'support', 'assistance'],
        response: 'You can reach our 24/7 support through:\n- Phone: +254 20 2994000\n- Email: info@sha.go.ke\n- Visit our offices at SHA Building, Ragati Road'
    }
];

export function getBotResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    for (const item of chatbotResponses) {
        if (item.keywords.some(keyword => message.includes(keyword))) {
            return item.response;
        }
    }
    
    return "I'm sorry, I couldn't understand your question. Please contact our support team for assistance or try rephrasing your question.";
} 