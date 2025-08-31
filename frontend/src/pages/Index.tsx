import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Brain, 
  TrendingUp, 
  Shield, 
  Smartphone,
  Zap,
  ChevronRight,
  Star
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full mb-8 shadow-2xl">
          <DollarSign className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          FinanceAI
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Transform your financial life with AI-powered transaction tracking and intelligent spending insights
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-3 shadow-lg transition-all duration-300 hover:shadow-xl">
              Get Started Free
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Star className="w-4 h-4 mr-1" />
            No credit card required
          </Badge>
        </div>

        {/* Demo Preview */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
          <Card className="relative bg-card/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-left space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Brain className="w-5 h-5 text-accent" />
                  <span className="text-muted-foreground">You:</span>
                  <span>"Coffee at Starbucks $6.50"</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">AI:</span>
                  <span>Parsed as <strong>$6.50 expense</strong> in <strong>Food & Dining</strong> category</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose FinanceAI?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>AI-Powered Parsing</CardTitle>
              <CardDescription>
                Simply describe your transactions in natural language. Our AI understands and categorizes them instantly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Smart Insights</CardTitle>
              <CardDescription>
                Get intelligent spending patterns, budget recommendations, and financial insights tailored to your habits.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Bank-Level Security</CardTitle>
              <CardDescription>
                Your financial data is protected with enterprise-grade encryption and secure authentication.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Mobile Optimized</CardTitle>
              <CardDescription>
                Track expenses on the go with our responsive design that works perfectly on any device.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Add transactions in seconds, not minutes. Our streamlined interface keeps you productive.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Free to Start</CardTitle>
              <CardDescription>
                Begin your financial journey at no cost. Upgrade when you're ready for advanced features.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who have transformed their financial habits with FinanceAI
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-3 shadow-lg transition-all duration-300 hover:shadow-xl">
              Start Your Financial Journey
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <DollarSign className="w-5 h-5" />
            <span className="font-semibold">FinanceAI</span>
          </div>
          <p className="text-sm">
            Smart finance tracking with AI-powered insights. Your financial freedom starts here.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
