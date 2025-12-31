import { useState } from "react";
import {
    HiOutlineQuestionMarkCircle,
    HiOutlineEnvelope,
    HiOutlinePhone,
    HiOutlineChatBubbleLeftRight,
    HiOutlineDocument,
    HiOutlineChevronDown,
    HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

const faqs = [
    {
        category: "Getting Started",
        questions: [
            {
                q: "How do I add a new flock?",
                a: "Navigate to the Flocks page and click the 'Add New Flock' button. Fill in the flock details including type, count, and batch information. Click 'Add Flock' to save."
            },
            {
                q: "How do I record a sale?",
                a: "Go to the Sales page and click 'New Sale'. Select the customer, add items, specify quantity and price. Choose payment method and click 'Create Invoice'."
            },
            {
                q: "How do I track inventory?",
                a: "Visit the Inventory page to see all feed, medicine, and supplies. You'll receive low-stock alerts automatically. Click 'Update Stock' to add or remove items."
            },
        ]
    },
    {
        category: "Health Management",
        questions: [
            {
                q: "How do I log daily health entries?",
                a: "Go to Health Log and click 'Add Entry'. Select the flock, enter mortality count, egg production/weight, feed and water consumption. Add notes and save."
            },
            {
                q: "How do I schedule vaccinations?",
                a: "In the Health Log, switch to the 'Vaccinations' tab. Click on scheduled vaccinations to mark them complete or add new vaccination schedules."
            },
            {
                q: "What should I do for critical health cases?",
                a: "Immediately log a health entry with status 'Critical'. Add detailed notes about symptoms. The system will flag it in the 'Health Cases' tab for urgent attention."
            },
        ]
    },
    {
        category: "Reports & Analytics",
        questions: [
            {
                q: "How do I view sales reports?",
                a: "The Dashboard shows a summary of today's sales. For detailed reports, visit the Sales page where you can filter by date, status, and customer."
            },
            {
                q: "Can I export data?",
                a: "Yes! Most pages have an export option. Look for the export button to download data as CSV or PDF for your records."
            },
            {
                q: "How do I track flock health trends?",
                a: "Visit the Dashboard's 'Flock Health Overview' section to see real-time health scores. The Health Log page shows historical data and trends."
            },
        ]
    },
    {
        category: "Account & Settings",
        questions: [
            {
                q: "How do I change my password?",
                a: "Go to Settings > Security tab. Enter your current password and new password twice. Click 'Save Changes' to update."
            },
            {
                q: "Can I customize notifications?",
                a: "Yes! In Settings > Notifications, you can toggle email alerts for sales, low stock, and health updates based on your preferences."
            },
            {
                q: "How do I change the language?",
                a: "Navigate to Settings > Preferences. Select your preferred language from the dropdown menu and save changes."
            },
        ]
    },
];

const contactMethods = [
    {
        icon: HiOutlineEnvelope,
        title: "Email Support",
        description: "Get help via email within 24 hours",
        contact: "support@farmmanager.com",
        action: "Send Email",
        color: "emerald"
    },
    {
        icon: HiOutlinePhone,
        title: "Phone Support",
        description: "Call us for immediate assistance",
        contact: "+977 01-1234567",
        action: "Call Now",
        color: "sky"
    },
    {
        icon: HiOutlineChatBubbleLeftRight,
        title: "Live Chat",
        description: "Chat with our support team",
        contact: "Available 9 AM - 6 PM NPT",
        action: "Start Chat",
        color: "amber"
    },
];

export default function Help() {
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaq, setOpenFaq] = useState(null);

    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
            item =>
                item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <section className="space-y-8">
            {/* Header */}
            <header className="text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 mb-4">
                    <HiOutlineQuestionMarkCircle className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">How can we help you?</h1>
                <p className="text-slate-600 max-w-2xl mx-auto">
                    Search our knowledge base or get in touch with our support team
                </p>
            </header>

            {/* Search */}
            <div className="max-w-2xl mx-auto animate-fade-delay-1">
                <div className="relative">
                    <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-organic pl-12 text-center"
                    />
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid gap-4 md:grid-cols-3 animate-fade-delay-2">
                <QuickLinkCard
                    icon={HiOutlineDocument}
                    title="User Guide"
                    description="Complete documentation"
                    color="emerald"
                />
                <QuickLinkCard
                    icon={HiOutlineQuestionMarkCircle}
                    title="Video Tutorials"
                    description="Step-by-step guides"
                    color="sky"
                />
                <QuickLinkCard
                    icon={HiOutlineChatBubbleLeftRight}
                    title="Community Forum"
                    description="Connect with other farmers"
                    color="amber"
                />
            </div>

            {/* FAQs */}
            <div className="max-w-4xl mx-auto animate-fade-delay-3">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                    Frequently Asked Questions
                </h2>

                {filteredFaqs.length > 0 ? (
                    <div className="space-y-6">
                        {filteredFaqs.map((category, catIndex) => (
                            <div key={catIndex} className="card-organic p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    {category.category}
                                </h3>
                                <div className="space-y-3">
                                    {category.questions.map((item, index) => {
                                        const faqId = `${catIndex}-${index}`;
                                        const isOpen = openFaq === faqId;

                                        return (
                                            <div
                                                key={index}
                                                className="border border-slate-200 rounded-xl overflow-hidden transition-all"
                                            >
                                                <button
                                                    onClick={() => setOpenFaq(isOpen ? null : faqId)}
                                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                                                >
                                                    <span className="font-medium text-slate-900">{item.q}</span>
                                                    <HiOutlineChevronDown
                                                        className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>
                                                {isOpen && (
                                                    <div className="px-4 pb-4 pt-2 bg-slate-50 border-t border-slate-200">
                                                        <p className="text-slate-600 leading-relaxed">{item.a}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 card-organic">
                        <p className="text-slate-500">No results found. Try a different search term.</p>
                    </div>
                )}
            </div>

            {/* Contact Support */}
            <div className="max-w-5xl mx-auto animate-fade-delay-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                    Still need help?
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {contactMethods.map((method, index) => (
                        <ContactCard key={index} {...method} />
                    ))}
                </div>
            </div>

            {/* Submit Ticket */}
            <div className="max-w-2xl mx-auto animate-fade-delay-5">
                <div className="card-organic p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Submit a Support Ticket</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                            <input
                                type="text"
                                placeholder="Brief description of your issue"
                                className="input-organic"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                            <select className="input-organic">
                                <option>Select a category...</option>
                                <option>Technical Issue</option>
                                <option>Billing Question</option>
                                <option>Feature Request</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                            <textarea
                                rows="4"
                                placeholder="Describe your issue in detail..."
                                className="input-organic resize-none"
                            ></textarea>
                        </div>
                        <button type="submit" className="btn-primary w-full">
                            Submit Ticket
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

function QuickLinkCard({ icon: Icon, title, description, color }) {
    const colorClasses = {
        emerald: "bg-emerald-100 text-emerald-600",
        sky: "bg-sky-100 text-sky-600",
        amber: "bg-amber-100 text-amber-600",
    };

    return (
        <button className="card-organic p-6 text-left hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
        </button>
    );
}

function ContactCard({ icon: Icon, title, description, contact, action, color }) {
    const colorClasses = {
        emerald: "bg-emerald-100 text-emerald-600 border-emerald-200",
        sky: "bg-sky-100 text-sky-600 border-sky-200",
        amber: "bg-amber-100 text-amber-600 border-amber-200",
    };

    return (
        <div className="card-organic p-6 text-center">
            <div className={`w-14 h-14 rounded-2xl ${colorClasses[color]} flex items-center justify-center mx-auto mb-4`}>
                <Icon className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 mb-3">{description}</p>
            <p className="font-medium text-slate-700 mb-4">{contact}</p>
            <button className="btn-secondary text-sm w-full">{action}</button>
        </div>
    );
}
