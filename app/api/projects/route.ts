import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import clientPromise from '@/lib/mongodb';

// GET - Fetch all projects for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const projects = client.db('Extensify').collection('projects');

    const userProjects = await projects
      .find({ userEmail: session.user.email })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({ projects: userProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST - Create a new project
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, blocks, settings } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const projects = client.db('Extensify').collection('projects');

    const newProject = {
      name,
      description: description || '',
      blocks: blocks || [],
      settings: settings || {},
      userEmail: session.user.email,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };

    const result = await projects.insertOne(newProject);

    return NextResponse.json({
      success: true,
      project: { ...newProject, _id: result.insertedId },
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
