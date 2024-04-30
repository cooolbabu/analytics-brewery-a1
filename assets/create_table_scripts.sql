DROP TABLE IF EXISTS ab_user_prompts;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE ab_user_prompts (
    prompt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    provider VARCHAR(255),
    model VARCHAR(255),
    persona VARCHAR(255),
    prompt_msg TEXT,
    tags varchar(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS ab_user_prompts_history;
CREATE TABLE ab_user_prompts_history (
    prompt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id varchar(255),
    user_id VARCHAR(255) NOT NULL,
    provider VARCHAR(255),
    model VARCHAR(255),
    persona VARCHAR(255),
    prompt_msg TEXT,
    tags varchar(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS ab_prompt_template;
CREATE TABLE ab_prompt_template (
    prompt_template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    prompt_template TEXT,
    prompt_template_desc varchar(255),
    tags varchar(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS prompt_comments;

CREATE TABLE prompt_comments (
    comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    comment_msg TEXT NOT NULL,
    header_comment_id VARCHAR(255),
    comment_rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ab_user_prompts (prompt_id, user_id, provider, model, persona, prompt_Msg, tags) VALUES
('b13fd88e-40e1-11ed-b878-0242ac120002', 'user1', 'OpenAI', 'GPT-4', 'Assistant', 'How do I create a PostgreSQL table? by user1', ARRAY['sql', 'postgres', 'database']),
('b13fdaf0-40e1-11ed-b878-0242ac120002', 'user1', 'Google', 'BERT', 'Researcher', 'What are the latest trends in machine learning? by user1', ARRAY['machine learning', 'research']),
('b13fdcf8-40e1-11ed-b878-0242ac120002', 'user2', 'IBM', 'Watson', 'Advisor', 'Recommend best practices for data security. by user2', ARRAY['data security', 'best practices']),
('b13fdee2-40e1-11ed-b878-0242ac120002', 'user2', 'Microsoft', 'Azure AI', 'Developer', 'Integrate AI capabilities into an existing app. by user2', ARRAY['AI integration', 'Azure', 'app development']),
('b13fe0b8-40e1-11ed-b878-0242ac120002', 'user2', 'Amazon', 'Lex', 'Customer Support', 'How to improve customer service with AI by user2?', ARRAY['customer service', 'AI']);

select * FROM ab_user_prompts;


INSERT INTO ab_user_prompts (user_id, provider, model, persona, prompt_Msg, tags) VALUES
('user1', 'OpenAI', 'GPT-4', 'Assistant', 'How do I create a PostgreSQL table? by user1', ARRAY['sql', 'postgres', 'database'])

DROP TABLE IF EXISTS ab_prompt_execution_history;
CREATE TABLE ab_prompt_execution_history (
    ab_prompt_execution_history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    provider varchar(255),
    model varchar(255),
    persona varchar(255),
    prompt_query TEXT,
    sql_statement TEXT,
    execution_status boolean,
    header_hash varchar(255),
    data_hash varchar(255),
    sql_err_message    
    tags varchar(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS ab_user_profile;
CREATE TABLE ab_user_profile (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_id VARCHAR(255) NOT NULL,
    first_name varchar(255),
    last_name varchar(255),
    date_registered TIMESTAMP,
    current_token_count INTEGER,
    tokens_available INTEGER,
    tokens_availablity INTEGER,
    tokens_added_history TEXT
);