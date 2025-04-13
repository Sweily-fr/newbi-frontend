import React from 'react';
import { BlogSeoOptimizer } from '../components/business/BlogSeoOptimizer';
// import { PageTitle } from '../components/ui/';

const BlogSeoOptimizerPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* <PageTitle title="Optimisation Blog SEO" /> */}
      <div className="mt-6">
        <BlogSeoOptimizer />
      </div>
    </div>
  );
};

export default BlogSeoOptimizerPage;
